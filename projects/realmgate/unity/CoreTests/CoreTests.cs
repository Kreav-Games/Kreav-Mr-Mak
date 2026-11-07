using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Realmgate.Core;
using Xunit;

public class GeometryTests
{
    static List<V2> Square(float s) => new List<V2> { new V2(0, 0), new V2(s, 0), new V2(s, s), new V2(0, s) };

    [Fact]
    public void HullAreaContains()
    {
        var hull = Geometry.ConvexHull(new[] { new V2(0, 0), new V2(2, 0), new V2(2, 2), new V2(0, 2), new V2(1, 1) });
        Assert.Equal(4, hull.Count);
        Assert.Equal(4f, Geometry.Area(hull), 3);
        Assert.True(Geometry.Contains(hull, new V2(1, 1)));
        Assert.False(Geometry.Contains(hull, new V2(3, 1)));
    }

    [Fact]
    public void TriangulatesConcaveL()
    {
        var l = new List<V2> { new V2(0, 0), new V2(3, 0), new V2(3, 1), new V2(1, 1), new V2(1, 3), new V2(0, 3) };
        var tris = Geometry.Triangulate(l);
        Assert.Equal((l.Count - 2) * 3, tris.Count);
        float area = 0;
        for (int i = 0; i < tris.Count; i += 3) area += Geometry.Area(new[] { l[tris[i]], l[tris[i + 1]], l[tris[i + 2]] });
        Assert.Equal(Geometry.Area(l), area, 3);
    }

    [Fact]
    public void SimplifyDropsCollinearPoints()
    {
        var pts = new List<V2> { new V2(0, 0), new V2(1, 0.01f), new V2(2, 0), new V2(2, 2), new V2(1, 2), new V2(0, 2) };
        Assert.Equal(4, Geometry.Simplify(pts, 0.05f).Count);
    }
}

public class ScanTests
{
    // Column-major matrix with yaw `a` (radians, about +y in ARKit) at (x, y, z).
    static float[] M(float a, float x, float y, float z) => new[]
    {
        MathF.Cos(a), 0, -MathF.Sin(a), 0,
        0, 1, 0, 0,
        MathF.Sin(a), 0, MathF.Cos(a), 0,
        x, y, z, 1,
    };

    static RoomPlanRoom Room()
    {
        var room = new RoomPlanRoom { sections = { "kitchen" } };
        // 4 x 3 m room centred on (0, -1.5) in ARKit coordinates (z forward is negative).
        room.walls.Add(new RoomPlanItem { t = M(0, 0, 1.2f, 0), dim = new[] { 4f, 2.4f, 0 } });
        room.walls.Add(new RoomPlanItem { t = M(0, 0, 1.2f, -3), dim = new[] { 4f, 2.4f, 0 } });
        room.walls.Add(new RoomPlanItem { t = M(MathF.PI / 2, -2, 1.2f, -1.5f), dim = new[] { 3f, 2.4f, 0 } });
        room.walls.Add(new RoomPlanItem { t = M(MathF.PI / 2, 2, 1.2f, -1.5f), dim = new[] { 3f, 2.4f, 0 } });
        room.doors.Add(new RoomPlanItem { t = M(MathF.PI / 2, 2, 1f, -1.5f), dim = new[] { 0.9f, 2f, 0 } });
        room.objects.Add(new RoomPlanItem { category = "table", t = M(0.3f, 0, 0.4f, -1.5f), dim = new[] { 1.2f, 0.75f, 0.8f } });
        return room;
    }

    [Fact]
    public void RoomPlanRoomBecomesAZoneInUnitySpace()
    {
        var zone = RoomPlanImport.ToZone(Room(), "k", "Kitchen");
        Assert.Equal(Themes.Forge, zone.theme);
        Assert.Equal(4, zone.floor.Count);
        // ARKit z = -3 mirrors to Unity z = +3: the room spans z 0..3.
        Assert.Equal(0f, zone.floor.Min(p => p[1]), 3);
        Assert.Equal(3f, zone.floor.Max(p => p[1]), 3);
        Assert.Single(zone.objects);
        Assert.Equal(1.5f, zone.objects[0].z, 3);
        // A yaw of +0.3 about ARKit +y is -0.3 in Unity's mirrored frame.
        Assert.Equal(-0.3f, zone.objects[0].yaw, 3);
        Assert.Equal(0f, zone.floorY, 3);
    }

    [Fact]
    public void AdjacentZonesLinkAtTheDoor()
    {
        var world = WorldBuilder.NewWorld("Home");
        WorldBuilder.AddZone(world, RoomPlanImport.ToZone(Room(), "k", "Kitchen"));
        var hall = new Zone { id = "h", name = "Hall", kind = ZoneKind.Hall,
            floor = new List<float[]> { new[] { 2.1f, 1f }, new[] { 5f, 1f }, new[] { 5f, 2f }, new[] { 2.1f, 2f } } };
        WorldBuilder.AddZone(world, hall);
        var far = new Zone { id = "y", name = "Yard", kind = ZoneKind.Outdoor,
            floor = new List<float[]> { new[] { 20f, 0f }, new[] { 25f, 0f }, new[] { 25f, 5f } } };
        WorldBuilder.AddZone(world, far);
        Assert.Single(world.links);
        Assert.Equal(2f, world.links[0].x, 2); // at the door on the x = 2 wall
        Assert.Equal("k", world.hearth.zone);
    }

    [Fact]
    public void AreaScanFindsObstaclesAboveTheDeck()
    {
        var floor = new List<V2> { new V2(0, 0), new V2(6, 0), new V2(6, 4), new V2(0, 4) };
        var mesh = new List<(float, float, float)>();
        for (float x = 2; x < 3; x += 0.1f) for (float z = 1; z < 2; z += 0.1f) mesh.Add((x, 0.9f, z)); // a grill
        mesh.Add((5, 0.02f, 3)); // floor noise
        var zone = AreaScanImport.ToZone(floor, mesh, 0, "d", "Deck", ZoneKind.Outdoor);
        Assert.Equal(Themes.Wilds, zone.theme);
        var o = Assert.Single(zone.objects);
        Assert.InRange(o.x, 2.2f, 2.8f);
        Assert.InRange(o.w, 0.9f, 1.3f);
    }

    [Fact]
    public void WorldRoundTripsAsServerJson()
    {
        var world = WorldBuilder.NewWorld("Home");
        WorldBuilder.AddZone(world, RoomPlanImport.ToZone(Room(), "k", "Kitchen"));
        var json = JsonConvert.SerializeObject(world);
        Assert.Contains("\"floor\":[[", json);
        Assert.Contains("\"hearth\":{", json);
        var back = JsonConvert.DeserializeObject<World>(json);
        Assert.Equal(world.zones[0].objects[0].cat, back.zones[0].objects[0].cat);
    }

    [Fact]
    public void PluginOutputParses()
    {
        var json = "{\"ok\":true,\"worldMapPath\":\"/x/map.arworldmap\",\"rooms\":[{\"sections\":[\"bedroom\"],\"floors\":[{\"t\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"dim\":[3,0,3],\"corners\":[[0,0,0],[3,0,0],[3,0,-3],[0,0,-3]]}],\"walls\":[],\"doors\":[],\"openings\":[],\"windows\":[],\"objects\":[{\"category\":\"bed\",\"t\":[1,0,0,0,0,1,0,0,0,0,1,0,1,0.3,-1,1],\"dim\":[1.6,0.6,2]}]}]}";
        var r = JsonConvert.DeserializeObject<RoomPlanResult>(json);
        var zone = RoomPlanImport.ToZone(r.rooms[0], "b", "Bedroom");
        Assert.Equal(Themes.Barracks, zone.theme);
        Assert.Equal(9f, Geometry.Area(zone.floor.Select(V2.From).ToList()), 3);
        Assert.Equal(1f, zone.objects[0].z, 3);
    }
}
