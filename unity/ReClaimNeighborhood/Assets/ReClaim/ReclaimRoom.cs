using System;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace ReClaim
{
    /// <summary>
    /// Playable neighborhood room controller.
    /// Manages character movement, 2D scene objects, interactive hotspots,
    /// sorting practice, and responsive Canvas presentation.
    /// Preserves SetContributions(string) on GameObject named ReclaimRoom for browser bridge.
    /// </summary>
    public class ReclaimRoom : MonoBehaviour
    {
        [Header("2D Scene Objects")]
        [SerializeField] private Transform characterTransform;
        [SerializeField] private SpriteRenderer characterRenderer;
        [SerializeField] private SpriteRenderer environmentRenderer;

        [Header("Movement Settings")]
        [SerializeField] private float moveSpeed = 4.5f;
        [SerializeField] private float stepSize = 0.5f;
        [SerializeField] private Vector2 boundsX = new Vector2(-3.25f, 3.25f);
        [SerializeField] private Vector2 boundsY = new Vector2(-1.85f, 1.85f);

        [Header("Canvas & Text UI")]
        [SerializeField] private TextMeshProUGUI headerTitleText;
        [SerializeField] private TextMeshProUGUI contributionBadgeText;
        [SerializeField] private TextMeshProUGUI messageText;
        [SerializeField] private TextMeshProUGUI footerText;

        [Header("Interaction Buttons")]
        [SerializeField] private Button artGalleryButton;
        [SerializeField] private Button gardenButton;
        [SerializeField] private Button sortingPracticeButton;

        [Header("Sorting Practice Response Group")]
        [SerializeField] private GameObject sortingButtonGroup;
        [SerializeField] private Button yesButton;
        [SerializeField] private Button noButton;

        [Header("Touch Movement Buttons")]
        [SerializeField] private Button moveLeftButton;
        [SerializeField] private Button moveRightButton;
        [SerializeField] private Button moveUpButton;
        [SerializeField] private Button moveDownButton;

        // Runtime state
        private int contributions = 0;
        private bool sorting = false;
        private string currentMessage = "Move with arrow keys or WASD. Explore the gallery, garden and sorting station.";
        private Vector2 characterPos = new Vector2(0f, -0.1f);
        private Vector2 continuousInput = Vector2.zero;

        // Public accessors for testing & verification
        public int Contributions => contributions;
        public bool IsSortingPracticeActive => sorting;
        public string CurrentMessage => currentMessage;
        public Vector2 CharacterPosition => characterPos;

        private void Awake()
        {
            EnsureSceneReferences();
            WireButtons();
        }

        private void OnEnable()
        {
            EnsureSceneReferences();
            WireButtons();
            UpdateAllUI();
        }

        private void Start()
        {
            UpdateAllUI();
            SyncCharacterTransform();
            AdjustCameraFraming();
        }

        /// <summary>
        /// Browser bridge entry point. Called via SendMessage from web wrapper.
        /// Distinctly updates virtual/demo participation counts without claiming physical impact.
        /// </summary>
        public void SetContributions(string value)
        {
            if (int.TryParse(value, out int count))
            {
                contributions = Mathf.Max(0, count);
                UpdateAllUI();
            }
        }

        /// <summary>
        /// Moves character by a delta, clamped within walkable room boundaries.
        /// </summary>
        public void Move(float deltaX, float deltaY)
        {
            characterPos.x = Mathf.Clamp(characterPos.x + deltaX, boundsX.x, boundsX.y);
            characterPos.y = Mathf.Clamp(characterPos.y + deltaY, boundsY.x, boundsY.y);

            if (characterRenderer != null && Mathf.Abs(deltaX) > 0.001f)
            {
                characterRenderer.flipX = deltaX < 0f;
            }

            SyncCharacterTransform();
        }

        private void SyncCharacterTransform()
        {
            if (characterTransform != null)
            {
                Vector3 envCenter = environmentRenderer != null ? environmentRenderer.transform.position : Vector3.zero;
                characterTransform.position = new Vector3(envCenter.x + characterPos.x, envCenter.y + characterPos.y, -0.1f);
            }
        }

        private void Update()
        {
            HandleKeyboardInput();

            if (continuousInput.sqrMagnitude > 0.001f)
            {
                Vector2 moveDelta = continuousInput.normalized * (moveSpeed * Time.deltaTime);
                Move(moveDelta.x, moveDelta.y);
            }
        }

        private void LateUpdate()
        {
            AdjustCameraFraming();
        }

        private void AdjustCameraFraming()
        {
            Camera cam = Camera.main;
            if (cam == null) return;

            cam.orthographic = true;
            float aspect = cam.aspect > 0.01f ? cam.aspect : (9f / 16f);
            // Ensure width of at least 9.4 units is visible in portrait
            float targetVisibleWidth = 9.4f;
            float requiredOrthoSize = (targetVisibleWidth * 0.5f) / aspect;
            cam.orthographicSize = Mathf.Max(6.2f, requiredOrthoSize);
        }

        private void HandleKeyboardInput()
        {
            Vector2 input = Vector2.zero;

#if ENABLE_INPUT_SYSTEM
            var kb = UnityEngine.InputSystem.Keyboard.current;
            if (kb != null)
            {
                if (kb.leftArrowKey.isPressed || kb.aKey.isPressed) input.x -= 1f;
                if (kb.rightArrowKey.isPressed || kb.dKey.isPressed) input.x += 1f;
                if (kb.upArrowKey.isPressed || kb.wKey.isPressed) input.y += 1f;
                if (kb.downArrowKey.isPressed || kb.sKey.isPressed) input.y -= 1f;
            }
#endif

#if ENABLE_LEGACY_INPUT_MANAGER
            if (Input.GetKey(KeyCode.LeftArrow) || Input.GetKey(KeyCode.A)) input.x -= 1f;
            if (Input.GetKey(KeyCode.RightArrow) || Input.GetKey(KeyCode.D)) input.x += 1f;
            if (Input.GetKey(KeyCode.UpArrow) || Input.GetKey(KeyCode.W)) input.y += 1f;
            if (Input.GetKey(KeyCode.DownArrow) || Input.GetKey(KeyCode.S)) input.y -= 1f;
#endif

            continuousInput = input;
        }

        #region Interactions

        public void SelectArtGallery()
        {
            sorting = false;
            currentMessage = contributions + " demo contributions. Shared art celebrates participation.";
            UpdateAllUI();
        }

        public void SelectGarden()
        {
            sorting = false;
            currentMessage = "Virtual growth celebrates habits. Real compost deliveries need separate verification.";
            UpdateAllUI();
        }

        public void SelectSortingPractice()
        {
            sorting = true;
            currentMessage = "Does a plastic cup belong in this station’s organics?";
            UpdateAllUI();
        }

        /// <summary>
        /// Handles sorting practice answers.
        /// Practice must never increment drop counts.
        /// </summary>
        public void AnswerSortingPractice(bool isYes)
        {
            if (isYes)
            {
                currentMessage = "Try again: plastic cups stay out of this organics stream.";
            }
            else
            {
                currentMessage = "Correct! Keep the plastic cup out. Check local station guidance each visit.";
                sorting = false;
            }

            UpdateAllUI();
        }

        public void MoveLeft() => Move(-stepSize, 0f);
        public void MoveRight() => Move(stepSize, 0f);
        public void MoveUp() => Move(0f, stepSize);
        public void MoveDown() => Move(0f, -stepSize);

        #endregion

        #region UI Updates & Wiring

        private void UpdateAllUI()
        {
            if (headerTitleText != null)
            {
                headerTitleText.text = "ReClaim • Your playable neighborhood";
            }

            if (contributionBadgeText != null)
            {
                contributionBadgeText.text = "Demo: " + contributions + " drops\n<size=75%>(virtual)</size>";
            }

            if (messageText != null)
            {
                messageText.text = currentMessage;
            }

            if (sortingButtonGroup != null)
            {
                sortingButtonGroup.SetActive(sorting);
            }

            if (footerText != null)
            {
                footerText.text = "Prototype • original ReClaim art • practice is not a verified drop-off";
            }
        }

        private void WireButtons()
        {
            if (artGalleryButton != null)
            {
                artGalleryButton.onClick.RemoveAllListeners();
                artGalleryButton.onClick.AddListener(SelectArtGallery);
            }

            if (gardenButton != null)
            {
                gardenButton.onClick.RemoveAllListeners();
                gardenButton.onClick.AddListener(SelectGarden);
            }

            if (sortingPracticeButton != null)
            {
                sortingPracticeButton.onClick.RemoveAllListeners();
                sortingPracticeButton.onClick.AddListener(SelectSortingPractice);
            }

            if (yesButton != null)
            {
                yesButton.onClick.RemoveAllListeners();
                yesButton.onClick.AddListener(() => AnswerSortingPractice(true));
            }

            if (noButton != null)
            {
                noButton.onClick.RemoveAllListeners();
                noButton.onClick.AddListener(() => AnswerSortingPractice(false));
            }

            if (moveLeftButton != null)
            {
                moveLeftButton.onClick.RemoveAllListeners();
                moveLeftButton.onClick.AddListener(MoveLeft);
            }

            if (moveRightButton != null)
            {
                moveRightButton.onClick.RemoveAllListeners();
                moveRightButton.onClick.AddListener(MoveRight);
            }

            if (moveUpButton != null)
            {
                moveUpButton.onClick.RemoveAllListeners();
                moveUpButton.onClick.AddListener(MoveUp);
            }

            if (moveDownButton != null)
            {
                moveDownButton.onClick.RemoveAllListeners();
                moveDownButton.onClick.AddListener(MoveDown);
            }
        }

        private void EnsureSceneReferences()
        {
            if (environmentRenderer == null)
            {
                var envObj = GameObject.Find("Environment");
                if (envObj != null) environmentRenderer = envObj.GetComponent<SpriteRenderer>();
            }

            if (characterTransform == null)
            {
                var charObj = GameObject.Find("Character");
                if (charObj != null)
                {
                    characterTransform = charObj.transform;
                    characterRenderer = charObj.GetComponent<SpriteRenderer>();
                }
            }

            if (environmentRenderer != null && environmentRenderer.sprite == null)
            {
                Sprite[] sprites = Resources.LoadAll<Sprite>("ReclaimRoomCharacter");
                foreach (var s in sprites)
                {
                    if (s.name == "Environment") environmentRenderer.sprite = s;
                }
            }

            if (characterRenderer != null && characterRenderer.sprite == null)
            {
                Sprite[] sprites = Resources.LoadAll<Sprite>("ReclaimRoomCharacter");
                foreach (var s in sprites)
                {
                    if (s.name == "Character") characterRenderer.sprite = s;
                }
            }

            var canvas = FindObjectOfType<Canvas>();
            if (canvas != null)
            {
                if (headerTitleText == null) headerTitleText = FindComponentInChildren<TextMeshProUGUI>(canvas.gameObject, "HeaderTitleText");
                if (contributionBadgeText == null) contributionBadgeText = FindComponentInChildren<TextMeshProUGUI>(canvas.gameObject, "ContributionBadgeText");
                if (messageText == null) messageText = FindComponentInChildren<TextMeshProUGUI>(canvas.gameObject, "MessageText");
                if (footerText == null) footerText = FindComponentInChildren<TextMeshProUGUI>(canvas.gameObject, "FooterText");

                if (sortingButtonGroup == null)
                {
                    var group = FindChildRecursive(canvas.transform, "SortingButtonGroup");
                    if (group != null) sortingButtonGroup = group.gameObject;
                }

                if (artGalleryButton == null) artGalleryButton = FindComponentInChildren<Button>(canvas.gameObject, "ArtGalleryButton");
                if (gardenButton == null) gardenButton = FindComponentInChildren<Button>(canvas.gameObject, "GardenButton");
                if (sortingPracticeButton == null) sortingPracticeButton = FindComponentInChildren<Button>(canvas.gameObject, "SortingPracticeButton");

                if (yesButton == null) yesButton = FindComponentInChildren<Button>(canvas.gameObject, "YesButton");
                if (noButton == null) noButton = FindComponentInChildren<Button>(canvas.gameObject, "NoButton");

                if (moveLeftButton == null) moveLeftButton = FindComponentInChildren<Button>(canvas.gameObject, "MoveLeftButton");
                if (moveRightButton == null) moveRightButton = FindComponentInChildren<Button>(canvas.gameObject, "MoveRightButton");
                if (moveUpButton == null) moveUpButton = FindComponentInChildren<Button>(canvas.gameObject, "MoveUpButton");
                if (moveDownButton == null) moveDownButton = FindComponentInChildren<Button>(canvas.gameObject, "MoveDownButton");
            }
        }

        private static T FindComponentInChildren<T>(GameObject root, string name) where T : Component
        {
            var target = FindChildRecursive(root.transform, name);
            return target != null ? target.GetComponent<T>() : null;
        }

        private static Transform FindChildRecursive(Transform parent, string name)
        {
            if (parent.name == name) return parent;
            for (int i = 0; i < parent.childCount; i++)
            {
                var found = FindChildRecursive(parent.GetChild(i), name);
                if (found != null) return found;
            }
            return null;
        }

#if UNITY_EDITOR
        private void OnValidate()
        {
            EnsureSceneReferences();
            UpdateAllUI();
        }
#endif
        #endregion
    }
}

