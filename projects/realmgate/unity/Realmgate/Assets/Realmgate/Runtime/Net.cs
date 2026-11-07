// WebSocket connection to the Realmgate room server (game/server/server.js).
// Messages are JSON. The receive loop runs on a worker thread and queues
// messages; the game drains the queue on the main thread every frame.
using System;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Realmgate
{
    public sealed class NetClient : IDisposable
    {
        readonly ClientWebSocket socket = new ClientWebSocket();
        readonly CancellationTokenSource cts = new CancellationTokenSource();
        readonly ConcurrentQueue<JObject> inbox = new ConcurrentQueue<JObject>();
        readonly SemaphoreSlim sendLock = new SemaphoreSlim(1, 1);

        public bool Connected => socket.State == WebSocketState.Open;
        public string Error { get; private set; }

        public async Task ConnectAsync(string url)
        {
            await socket.ConnectAsync(new Uri(url), cts.Token);
            _ = Task.Run(ReceiveLoop);
        }

        async Task ReceiveLoop()
        {
            var buffer = new byte[64 * 1024];
            var sb = new StringBuilder();
            try
            {
                while (!cts.IsCancellationRequested && socket.State == WebSocketState.Open)
                {
                    var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), cts.Token);
                    if (result.MessageType == WebSocketMessageType.Close) break;
                    sb.Append(Encoding.UTF8.GetString(buffer, 0, result.Count));
                    if (!result.EndOfMessage) continue;
                    try { inbox.Enqueue(JObject.Parse(sb.ToString())); } catch (JsonException) { }
                    sb.Clear();
                }
            }
            catch (Exception e) { Error = e.Message; }
            inbox.Enqueue(new JObject { ["t"] = "closed" });
        }

        public bool TryReceive(out JObject msg) => inbox.TryDequeue(out msg);

        public void Send(object msg)
        {
            if (!Connected) return;
            var bytes = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(msg));
            _ = SendAsync(bytes);
        }

        async Task SendAsync(byte[] bytes)
        {
            await sendLock.WaitAsync();
            try { await socket.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, cts.Token); }
            catch (Exception e) { Error = e.Message; }
            finally { sendLock.Release(); }
        }

        public void Dispose()
        {
            cts.Cancel();
            try { socket.Abort(); } catch { }
            socket.Dispose();
        }
    }

    // ------------------------------------------------------------ snapshots ---
    // Mirrors Sim.snapshot() in game/shared/sim.js.

    public class Snapshot
    {
        public float t;
        public PlayerState[] players;
        public EnemyState[] enemies;
        public PickupState[] pickups;
        public LootState[] loot;
        public NpcState[] npcs;
        public JObject[] events;
        public PrivateState me;
        public System.Collections.Generic.Dictionary<string, float> cds;
    }

    public class PlayerState
    {
        public string id, name, cls, target;
        public int level, maxHp, maxRes;
        public float x, z, f, hp, res;
        public bool alive;
        public string[] buffs;
    }

    public class EnemyState
    {
        public string id, type, name, target;
        public int level, maxHp;
        public float x, z, f, hp;
        public bool alive;
        public Windup wind;
        public string[] buffs;
    }

    public class Windup { public float x, z, r, left, dur; }
    public class PickupState { public string id, type; public float x, z; }
    public class LootState { public string id, rarity; public float x, z; }
    public class NpcState { public string id, name, kind; public float x, z; }

    public class PrivateState
    {
        public string id;
        public int xp, xpNext, gold;
        public JObject stats, equipment;
        public JArray bag;
        public System.Collections.Generic.Dictionary<string, QuestState> quests;
        public string[] available;
    }

    public class QuestState
    {
        public string state;
        public int[] progress;
    }
}
