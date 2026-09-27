using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem.UI;
using TMPro;

namespace ReClaim
{
    [InitializeOnLoad]
    public static class ReclaimSceneSetup
    {
        public const string ScenePath = "Assets/ReClaim/ReclaimNeighborhood.unity";

        static ReclaimSceneSetup()
        {
            EditorApplication.delayCall += EnsureScene;
        }

        static void EnsureScene()
        {
            if (!System.IO.File.Exists(ScenePath))
            {
                Build();
            }
        }

        [MenuItem("ReClaim/Open neighborhood scene")]
        public static void Open()
        {
            EnsureScene();
            if (EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo())
            {
                EditorSceneManager.OpenScene(ScenePath);
            }
        }

        [MenuItem("ReClaim/Rebuild neighborhood scene")]
        public static void RebuildMenu()
        {
            Build();
        }

        public static void Build()
        {
            var previous = SceneManager.GetActiveScene();
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

            // 1. Camera setup
            var camObj = new GameObject("Main Camera");
            camObj.tag = "MainCamera";
            camObj.transform.position = new Vector3(0f, 0.5f, -10f);
            var camera = camObj.AddComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.04f, 0.08f, 0.10f);
            camera.orthographic = true;
            camera.orthographicSize = 7.5f;

            // 2. Load Sprites from composite art
            Sprite envSprite = null;
            Sprite charSprite = null;
            Sprite[] sprites = Resources.LoadAll<Sprite>("ReclaimRoomCharacter");
            foreach (var s in sprites)
            {
                if (s.name == "Environment") envSprite = s;
                else if (s.name == "Character") charSprite = s;
            }

            // 3. Room 2D Scene Objects
            var roomRoot = new GameObject("RoomObjects");
            roomRoot.transform.position = Vector3.zero;

            var envObj = new GameObject("Environment");
            envObj.transform.SetParent(roomRoot.transform);
            envObj.transform.position = new Vector3(0f, 0.8f, 0f);
            var envRenderer = envObj.AddComponent<SpriteRenderer>();
            envRenderer.sprite = envSprite;
            envRenderer.sortingOrder = 0;

            var charObj = new GameObject("Character");
            charObj.transform.SetParent(roomRoot.transform);
            charObj.transform.position = new Vector3(0f, 0.7f, -0.1f);
            charObj.transform.localScale = new Vector3(0.25f, 0.25f, 1f);
            var charRenderer = charObj.AddComponent<SpriteRenderer>();
            charRenderer.sprite = charSprite;
            charRenderer.sortingOrder = 2;
            var charCol = charObj.AddComponent<CircleCollider2D>();
            charCol.isTrigger = true;
            charCol.radius = 1.0f;

            // In-room Hotspots
            var hotspotsRoot = new GameObject("Hotspots");
            hotspotsRoot.transform.SetParent(roomRoot.transform);
            hotspotsRoot.transform.position = new Vector3(0f, 0.8f, 0f);

            CreateHotspot(hotspotsRoot.transform, "ArtGalleryHotspot", new Vector3(-2.0f, 2.85f, -0.05f), new Vector2(2.4f, 1.2f), HotspotType.ArtGallery);
            CreateHotspot(hotspotsRoot.transform, "GardenHotspot", new Vector3(2.5f, 1.65f, -0.05f), new Vector2(2.4f, 1.2f), HotspotType.Garden);
            CreateHotspot(hotspotsRoot.transform, "SortingStationHotspot", new Vector3(-3.1f, -0.85f, -0.05f), new Vector2(2.4f, 1.2f), HotspotType.SortingStation);

            // 4. ReclaimRoom controller GameObject
            var roomObj = new GameObject("ReclaimRoom");
            var reclaimRoom = roomObj.AddComponent<ReclaimRoom>();

            // 5. EventSystem
            var eventSystemObj = new GameObject("EventSystem");
            eventSystemObj.AddComponent<EventSystem>();
            eventSystemObj.AddComponent<InputSystemUIInputModule>();

            // 6. Responsive Canvas UI (Mobile portrait first)
            var canvasObj = new GameObject("Canvas");
            var canvas = canvasObj.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080f, 1920f);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();

            // Default TMP Font
            TMP_FontAsset fontAsset = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>("Assets/TextMesh Pro/Resources/Fonts & Materials/LiberationSans SDF.asset");

            // --- Header Panel ---
            var headerObj = CreateUIObject("HeaderPanel", canvasObj.transform);
            var headerRect = headerObj.GetComponent<RectTransform>();
            headerRect.anchorMin = new Vector2(0f, 1f);
            headerRect.anchorMax = new Vector2(1f, 1f);
            headerRect.pivot = new Vector2(0.5f, 1f);
            headerRect.sizeDelta = new Vector2(0f, 160f);
            headerRect.anchoredPosition = Vector2.zero;
            var headerImg = headerObj.AddComponent<Image>();
            headerImg.color = new Color(0.04f, 0.08f, 0.10f, 0.92f);

            var titleObj = CreateUIObject("HeaderTitleText", headerObj.transform);
            var titleRect = titleObj.GetComponent<RectTransform>();
            titleRect.anchorMin = new Vector2(0f, 0f);
            titleRect.anchorMax = new Vector2(0.68f, 1f);
            titleRect.offsetMin = new Vector2(35f, 15f);
            titleRect.offsetMax = new Vector2(0f, -15f);
            var titleTMP = titleObj.AddComponent<TextMeshProUGUI>();
            if (fontAsset != null) titleTMP.font = fontAsset;
            titleTMP.text = "ReClaim • Your playable neighborhood";
            titleTMP.fontSize = 34;
            titleTMP.fontStyle = FontStyles.Bold;
            titleTMP.color = new Color(0.94f, 0.98f, 0.95f);
            titleTMP.verticalAlignment = VerticalAlignmentOptions.Middle;
            titleTMP.textWrappingMode = TextWrappingModes.Normal;

            var badgeObj = CreateUIObject("ContributionBadge", headerObj.transform);
            var badgeRect = badgeObj.GetComponent<RectTransform>();
            badgeRect.anchorMin = new Vector2(0.70f, 0.18f);
            badgeRect.anchorMax = new Vector2(0.97f, 0.82f);
            badgeRect.offsetMin = Vector2.zero;
            badgeRect.offsetMax = Vector2.zero;
            var badgeImg = badgeObj.AddComponent<Image>();
            badgeImg.color = new Color(0.08f, 0.22f, 0.16f, 0.90f);

            var badgeTextObj = CreateUIObject("ContributionBadgeText", badgeObj.transform);
            var badgeTextRect = badgeTextObj.GetComponent<RectTransform>();
            badgeTextRect.anchorMin = Vector2.zero;
            badgeTextRect.anchorMax = Vector2.one;
            badgeTextRect.offsetMin = new Vector2(10f, 5f);
            badgeTextRect.offsetMax = new Vector2(-10f, -5f);
            var badgeTMP = badgeTextObj.AddComponent<TextMeshProUGUI>();
            if (fontAsset != null) badgeTMP.font = fontAsset;
            badgeTMP.text = "Demo: 0 drops\n<size=75%>(virtual)</size>";
            badgeTMP.fontSize = 22;
            badgeTMP.fontStyle = FontStyles.Bold;
            badgeTMP.color = new Color(0.65f, 0.95f, 0.82f);
            badgeTMP.alignment = TextAlignmentOptions.Center;

            // --- Lower Controls Container ---
            var lowerContainer = CreateUIObject("LowerUIContainer", canvasObj.transform);
            var lowerRect = lowerContainer.GetComponent<RectTransform>();
            lowerRect.anchorMin = new Vector2(0f, 0f);
            lowerRect.anchorMax = new Vector2(1f, 0f);
            lowerRect.pivot = new Vector2(0.5f, 0f);
            lowerRect.sizeDelta = new Vector2(0f, 920f);
            lowerRect.anchoredPosition = Vector2.zero;

            // 1. Room Action Bar (Quick Navigation)
            var actionBarObj = CreateUIObject("ActionBarPanel", lowerContainer.transform);
            var actionRect = actionBarObj.GetComponent<RectTransform>();
            actionRect.anchorMin = new Vector2(0.04f, 0f);
            actionRect.anchorMax = new Vector2(0.96f, 0f);
            actionRect.pivot = new Vector2(0.5f, 0.5f);
            actionRect.anchoredPosition = new Vector2(0f, 850f);
            actionRect.sizeDelta = new Vector2(0f, 80f);
            var actionHlg = actionBarObj.AddComponent<HorizontalLayoutGroup>();
            actionHlg.spacing = 18f;
            actionHlg.childControlWidth = true;
            actionHlg.childControlHeight = true;
            actionHlg.childForceExpandWidth = true;
            actionHlg.childForceExpandHeight = true;

            var artBtn = CreateStyledButton("ArtGalleryButton", actionBarObj.transform, "Art gallery", new Color(0.12f, 0.22f, 0.26f), Color.white, fontAsset, 26);
            var gardenBtn = CreateStyledButton("GardenButton", actionBarObj.transform, "Garden", new Color(0.12f, 0.22f, 0.26f), Color.white, fontAsset, 26);
            var sortBtn = CreateStyledButton("SortingPracticeButton", actionBarObj.transform, "Sorting practice", new Color(0.15f, 0.32f, 0.24f), new Color(0.43f, 0.91f, 0.72f), fontAsset, 26);

            // 2. Feedback Card
            var feedbackCard = CreateUIObject("FeedbackCard", lowerContainer.transform);
            var fbRect = feedbackCard.GetComponent<RectTransform>();
            fbRect.anchorMin = new Vector2(0.04f, 0f);
            fbRect.anchorMax = new Vector2(0.96f, 0f);
            fbRect.pivot = new Vector2(0.5f, 0.5f);
            fbRect.anchoredPosition = new Vector2(0f, 680f);
            fbRect.sizeDelta = new Vector2(0f, 210f);
            var fbImg = feedbackCard.AddComponent<Image>();
            fbImg.color = new Color(0.06f, 0.12f, 0.15f, 0.95f);

            var messageObj = CreateUIObject("MessageText", feedbackCard.transform);
            var msgRect = messageObj.GetComponent<RectTransform>();
            msgRect.anchorMin = new Vector2(0.03f, 0.35f);
            msgRect.anchorMax = new Vector2(0.97f, 0.95f);
            msgRect.offsetMin = Vector2.zero;
            msgRect.offsetMax = Vector2.zero;
            var msgTMP = messageObj.AddComponent<TextMeshProUGUI>();
            if (fontAsset != null) msgTMP.font = fontAsset;
            msgTMP.text = "Move with arrow keys or WASD. Explore the gallery, garden and sorting station.";
            msgTMP.fontSize = 28;
            msgTMP.color = new Color(0.96f, 0.97f, 0.98f);
            msgTMP.alignment = TextAlignmentOptions.Center;
            msgTMP.textWrappingMode = TextWrappingModes.Normal;

            var sortingGroupObj = CreateUIObject("SortingButtonGroup", feedbackCard.transform);
            var sortGroupRect = sortingGroupObj.GetComponent<RectTransform>();
            sortGroupRect.anchorMin = new Vector2(0.1f, 0.08f);
            sortGroupRect.anchorMax = new Vector2(0.9f, 0.40f);
            sortGroupRect.offsetMin = Vector2.zero;
            sortGroupRect.offsetMax = Vector2.zero;
            var sortHlg = sortingGroupObj.AddComponent<HorizontalLayoutGroup>();
            sortHlg.spacing = 30f;
            sortHlg.childControlWidth = true;
            sortHlg.childControlHeight = true;
            sortHlg.childForceExpandWidth = true;
            sortHlg.childForceExpandHeight = true;

            var yesBtn = CreateStyledButton("YesButton", sortingGroupObj.transform, "Yes", new Color(0.28f, 0.33f, 0.40f), new Color(0.98f, 0.65f, 0.65f), fontAsset, 28);
            var noBtn = CreateStyledButton("NoButton", sortingGroupObj.transform, "No", new Color(0.03f, 0.45f, 0.32f), new Color(0.65f, 0.95f, 0.82f), fontAsset, 28);
            sortingGroupObj.SetActive(false);

            // 3. Touch D-Pad Panel
            var touchPanel = CreateUIObject("TouchControlsPanel", lowerContainer.transform);
            var touchRect = touchPanel.GetComponent<RectTransform>();
            touchRect.anchorMin = new Vector2(0.5f, 0f);
            touchRect.anchorMax = new Vector2(0.5f, 0f);
            touchRect.pivot = new Vector2(0.5f, 0.5f);
            touchRect.anchoredPosition = new Vector2(0f, 320f);
            touchRect.sizeDelta = new Vector2(500f, 320f);

            var moveUpBtn = CreateDirectionalButton("MoveUpButton", touchPanel.transform, "↑", new Vector2(0f, 95f), fontAsset);
            var moveLeftBtn = CreateDirectionalButton("MoveLeftButton", touchPanel.transform, "←", new Vector2(-155f, 0f), fontAsset);
            var moveRightBtn = CreateDirectionalButton("MoveRightButton", touchPanel.transform, "→", new Vector2(155f, 0f), fontAsset);
            var moveDownBtn = CreateDirectionalButton("MoveDownButton", touchPanel.transform, "↓", new Vector2(0f, -95f), fontAsset);

            // 4. Footer Panel
            var footerObj = CreateUIObject("FooterPanel", lowerContainer.transform);
            var footerRect = footerObj.GetComponent<RectTransform>();
            footerRect.anchorMin = new Vector2(0f, 0f);
            footerRect.anchorMax = new Vector2(1f, 0f);
            footerRect.pivot = new Vector2(0.5f, 0f);
            footerRect.sizeDelta = new Vector2(0f, 70f);
            footerRect.anchoredPosition = Vector2.zero;
            var footerImg = footerObj.AddComponent<Image>();
            footerImg.color = new Color(0.03f, 0.06f, 0.08f, 0.95f);

            var footerTextObj = CreateUIObject("FooterText", footerObj.transform);
            var footerTextRect = footerTextObj.GetComponent<RectTransform>();
            footerTextRect.anchorMin = Vector2.zero;
            footerTextRect.anchorMax = Vector2.one;
            footerTextRect.offsetMin = new Vector2(20f, 5f);
            footerTextRect.offsetMax = new Vector2(-20f, -5f);
            var footerTMP = footerTextObj.AddComponent<TextMeshProUGUI>();
            if (fontAsset != null) footerTMP.font = fontAsset;
            footerTMP.text = "Prototype • original ReClaim art • practice is not a verified drop-off";
            footerTMP.fontSize = 20;
            footerTMP.color = new Color(0.61f, 0.65f, 0.70f);
            footerTMP.alignment = TextAlignmentOptions.Center;

            // Wire all serialized fields on ReclaimRoom
            SerializedObject so = new SerializedObject(reclaimRoom);
            so.FindProperty("characterTransform").objectReferenceValue = charObj.transform;
            so.FindProperty("characterRenderer").objectReferenceValue = charRenderer;
            so.FindProperty("environmentRenderer").objectReferenceValue = envRenderer;
            so.FindProperty("headerTitleText").objectReferenceValue = titleTMP;
            so.FindProperty("contributionBadgeText").objectReferenceValue = badgeTMP;
            so.FindProperty("messageText").objectReferenceValue = msgTMP;
            so.FindProperty("footerText").objectReferenceValue = footerTMP;
            so.FindProperty("sortingButtonGroup").objectReferenceValue = sortingGroupObj;
            so.FindProperty("artGalleryButton").objectReferenceValue = artBtn;
            so.FindProperty("gardenButton").objectReferenceValue = gardenBtn;
            so.FindProperty("sortingPracticeButton").objectReferenceValue = sortBtn;
            so.FindProperty("yesButton").objectReferenceValue = yesBtn;
            so.FindProperty("noButton").objectReferenceValue = noBtn;
            so.FindProperty("moveLeftButton").objectReferenceValue = moveLeftBtn;
            so.FindProperty("moveRightButton").objectReferenceValue = moveRightBtn;
            so.FindProperty("moveUpButton").objectReferenceValue = moveUpBtn;
            so.FindProperty("moveDownButton").objectReferenceValue = moveDownBtn;
            so.ApplyModifiedPropertiesWithoutUndo();

            EditorSceneManager.SaveScene(scene, ScenePath);
            Debug.Log("ReClaim neighborhood scene successfully built with 2D scene objects and responsive Canvas.");
        }

        private static GameObject CreateUIObject(string name, Transform parent)
        {
            var go = new GameObject(name, typeof(RectTransform));
            go.transform.SetParent(parent, false);
            return go;
        }

        private static Button CreateStyledButton(string name, Transform parent, string label, Color bgColor, Color textColor, TMP_FontAsset font, float fontSize)
        {
            var go = CreateUIObject(name, parent);
            var img = go.AddComponent<Image>();
            img.color = bgColor;
            var btn = go.AddComponent<Button>();

            var textObj = CreateUIObject("Text", go.transform);
            var textRect = textObj.GetComponent<RectTransform>();
            textRect.anchorMin = Vector2.zero;
            textRect.anchorMax = Vector2.one;
            textRect.offsetMin = Vector2.zero;
            textRect.offsetMax = Vector2.zero;
            var tmp = textObj.AddComponent<TextMeshProUGUI>();
            if (font != null) tmp.font = font;
            tmp.text = label;
            tmp.fontSize = fontSize;
            tmp.fontStyle = FontStyles.Bold;
            tmp.color = textColor;
            tmp.alignment = TextAlignmentOptions.Center;

            return btn;
        }

        private static Button CreateDirectionalButton(string name, Transform parent, string arrow, Vector2 position, TMP_FontAsset font)
        {
            var go = CreateUIObject(name, parent);
            var rect = go.GetComponent<RectTransform>();
            rect.anchoredPosition = position;
            rect.sizeDelta = new Vector2(130f, 75f);
            var img = go.AddComponent<Image>();
            img.color = new Color(0.12f, 0.22f, 0.28f, 0.90f);
            var btn = go.AddComponent<Button>();

            var textObj = CreateUIObject("ArrowText", go.transform);
            var textRect = textObj.GetComponent<RectTransform>();
            textRect.anchorMin = Vector2.zero;
            textRect.anchorMax = Vector2.one;
            textRect.offsetMin = Vector2.zero;
            textRect.offsetMax = Vector2.zero;
            var tmp = textObj.AddComponent<TextMeshProUGUI>();
            if (font != null) tmp.font = font;
            tmp.text = arrow;
            tmp.fontSize = 44;
            tmp.fontStyle = FontStyles.Bold;
            tmp.color = new Color(0.92f, 0.95f, 0.98f);
            tmp.alignment = TextAlignmentOptions.Center;

            return btn;
        }

        private static void CreateHotspot(Transform parent, string name, Vector3 pos, Vector2 size, HotspotType type)
        {
            var go = new GameObject(name);
            go.transform.SetParent(parent, false);
            go.transform.localPosition = pos;
            var col = go.AddComponent<BoxCollider2D>();
            col.isTrigger = true;
            col.size = size;

            var hotspot = go.AddComponent<ReclaimHotspot>();
            var so = new SerializedObject(hotspot);
            so.FindProperty("hotspotType").enumValueIndex = (int)type;
            so.ApplyModifiedPropertiesWithoutUndo();
        }
    }
}

