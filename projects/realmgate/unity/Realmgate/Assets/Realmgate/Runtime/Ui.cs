// Minimal UGUI built from code (no prefabs to maintain while the game is a
// prototype): a portrait canvas, screens, labels, buttons, inputs and a stick.
using System;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem.UI;
using UnityEngine.UI;

namespace Realmgate
{
    public static class Ui
    {
        public static readonly Color Panel = new Color(0.08f, 0.06f, 0.12f, 0.88f);
        public static readonly Color Gold = new Color(1f, 0.83f, 0.29f);
        public static readonly Color ButtonColor = new Color(0.17f, 0.13f, 0.23f, 0.95f);
        static Font font;
        public static Font Font => font ? font : (font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf"));

        public static Canvas Canvas()
        {
            if (UnityEngine.Object.FindAnyObjectByType<EventSystem>() == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<EventSystem>();
                es.AddComponent<InputSystemUIInputModule>();
            }
            var go = new GameObject("UI");
            var canvas = go.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            var scaler = go.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;
            go.AddComponent<GraphicRaycaster>();
            return canvas;
        }

        public static RectTransform Rect(Transform parent, string name, Vector2 anchorMin, Vector2 anchorMax, Vector2 offsetMin, Vector2 offsetMax)
        {
            var go = new GameObject(name, typeof(RectTransform));
            var rt = (RectTransform)go.transform;
            rt.SetParent(parent, false);
            rt.anchorMin = anchorMin; rt.anchorMax = anchorMax;
            rt.offsetMin = offsetMin; rt.offsetMax = offsetMax;
            return rt;
        }

        public static RectTransform Fill(Transform parent, string name, float pad = 0) =>
            Rect(parent, name, Vector2.zero, Vector2.one, new Vector2(pad, pad), new Vector2(-pad, -pad));

        public static Image Box(RectTransform rt, Color color)
        {
            var img = rt.gameObject.AddComponent<Image>();
            img.color = color;
            return img;
        }

        public static Text Label(Transform parent, string text, int size = 40, TextAnchor align = TextAnchor.UpperLeft, Color? color = null)
        {
            var rt = Fill(parent, "Label");
            var t = rt.gameObject.AddComponent<Text>();
            t.font = Font;
            t.text = text;
            t.fontSize = size;
            t.alignment = align;
            t.color = color ?? Color.white;
            t.horizontalOverflow = HorizontalWrapMode.Wrap;
            t.verticalOverflow = VerticalWrapMode.Overflow;
            t.raycastTarget = false;
            var shadow = rt.gameObject.AddComponent<Shadow>();
            shadow.effectDistance = new Vector2(2, -2);
            return t;
        }

        // A vertical list that grows with its children; put it in a ScrollRect if needed.
        public static RectTransform Column(Transform parent, string name, float spacing = 18)
        {
            var rt = Fill(parent, name);
            var v = rt.gameObject.AddComponent<VerticalLayoutGroup>();
            v.spacing = spacing;
            v.childControlHeight = true; v.childControlWidth = true;
            v.childForceExpandHeight = false; v.childForceExpandWidth = true;
            v.padding = new RectOffset(40, 40, 60, 40);
            return rt;
        }

        public static Button Button(Transform parent, string text, Action onClick, float height = 120, Color? color = null)
        {
            var rt = Rect(parent, $"Button {text}", Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
            var img = Box(rt, color ?? ButtonColor);
            var b = rt.gameObject.AddComponent<UnityEngine.UI.Button>();
            b.targetGraphic = img;
            b.onClick.AddListener(() => onClick());
            var le = rt.gameObject.AddComponent<LayoutElement>();
            le.preferredHeight = height; le.minHeight = height;
            var label = Label(rt, text, 44, TextAnchor.MiddleCenter);
            label.name = "Text";
            return b;
        }

        public static Text Heading(Transform parent, string text, int size = 64, float height = 110)
        {
            var holder = Rect(parent, "Heading", Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
            holder.gameObject.AddComponent<LayoutElement>().preferredHeight = height;
            return Label(holder, text, size, TextAnchor.MiddleLeft, Gold);
        }

        public static Text Paragraph(Transform parent, string text, int size = 36, float height = 0)
        {
            var holder = Rect(parent, "Paragraph", Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
            var t = Label(holder, text, size);
            var fitter = holder.gameObject.AddComponent<LayoutElement>();
            fitter.preferredHeight = height > 0 ? height : Mathf.Max(60, t.preferredHeight + 10);
            return t;
        }

        public static InputField Input(Transform parent, string placeholder, string value)
        {
            var rt = Rect(parent, "Input", Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
            Box(rt, new Color(0.05f, 0.04f, 0.08f, 1f));
            rt.gameObject.AddComponent<LayoutElement>().preferredHeight = 110;
            var text = Label(rt, value ?? "", 42, TextAnchor.MiddleLeft);
            text.rectTransform.offsetMin = new Vector2(24, 0);
            text.raycastTarget = true;
            text.supportRichText = false;
            var ph = Label(rt, placeholder, 42, TextAnchor.MiddleLeft, new Color(1, 1, 1, 0.35f));
            ph.rectTransform.offsetMin = new Vector2(24, 0);
            var input = rt.gameObject.AddComponent<InputField>();
            input.textComponent = text;
            input.placeholder = ph;
            input.text = value ?? "";
            return input;
        }

        public static void Clear(Transform t)
        {
            for (int i = t.childCount - 1; i >= 0; i--) UnityEngine.Object.Destroy(t.GetChild(i).gameObject);
        }
    }

    // On-screen stick for remote guests walking the digital twin.
    public class Stick : MonoBehaviour, IPointerDownHandler, IDragHandler, IPointerUpHandler
    {
        public Vector2 Value;
        RectTransform knob;
        RectTransform rt;

        public static Stick Create(Transform parent)
        {
            var rt = Ui.Rect(parent, "Stick", new Vector2(0, 0), new Vector2(0, 0), new Vector2(60, 420), new Vector2(360, 720));
            Ui.Box(rt, new Color(1, 1, 1, 0.1f));
            var knob = Ui.Rect(rt, "Knob", new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-60, -60), new Vector2(60, 60));
            Ui.Box(knob, new Color(1, 1, 1, 0.35f)).raycastTarget = false;
            var s = rt.gameObject.AddComponent<Stick>();
            s.knob = knob; s.rt = rt;
            return s;
        }

        public void OnPointerDown(PointerEventData e) => OnDrag(e);

        public void OnDrag(PointerEventData e)
        {
            RectTransformUtility.ScreenPointToLocalPointInRectangle(rt, e.position, e.pressEventCamera, out var local);
            var v = local / (rt.rect.width / 2);
            Value = Vector2.ClampMagnitude(v, 1);
            knob.anchoredPosition = Value * (rt.rect.width / 2 - 60);
        }

        public void OnPointerUp(PointerEventData e)
        {
            Value = Vector2.zero;
            knob.anchoredPosition = Vector2.zero;
        }
    }
}
