// The scanned-world format shared with the game server (game/shared/world.js).
// Units are metres in Unity's frame (left-handed, y up), which is also the frame
// of the saved ARWorldMap, so a relocalized session lines up with the world.
// Field names are lower case because they are the JSON wire names.
using System;
using System.Collections.Generic;

namespace Realmgate.Core
{
    [Serializable]
    public class World
    {
        public int v = 1;
        public string id;
        public string name;
        public Hearth hearth;
        public List<Zone> zones = new List<Zone>();
        public List<Link> links = new List<Link>();
    }

    [Serializable]
    public class Hearth
    {
        public float x;
        public float z;
        public string zone;
    }

    [Serializable]
    public class Zone
    {
        public string id;
        public string name;
        public string kind = ZoneKind.Room; // room | hall | outdoor
        public string theme = Themes.Hearth;
        public float floorY;
        public List<float[]> floor = new List<float[]>(); // [x, z] outline
        public List<Wall> walls = new List<Wall>();
        public List<Opening> openings = new List<Opening>();
        public List<WorldObject> objects = new List<WorldObject>();
    }

    public static class ZoneKind
    {
        public const string Room = "room";
        public const string Hall = "hall";
        public const string Outdoor = "outdoor";
    }

    [Serializable]
    public class Wall
    {
        public float[] a; // [x, z]
        public float[] b;
        public float h = 2.4f;
        public float t = 0.1f;
    }

    [Serializable]
    public class Opening
    {
        public string kind = "door"; // door | opening | window
        public float x, y, z, w, h, yaw;
    }

    [Serializable]
    public class WorldObject
    {
        public string cat; // RoomPlan category: sofa, table, bed, stairs, ...
        public float x, y, z; // centre
        public float w, h, d; // size along local x, y, z
        public float yaw; // radians, Unity convention (transform.eulerAngles.y)
    }

    [Serializable]
    public class Link
    {
        public string a; // zone ids
        public string b;
        public float x, z, w = 0.9f;
    }
}
