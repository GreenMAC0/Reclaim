using UnityEngine;

namespace ReClaim
{
    public enum HotspotType
    {
        ArtGallery,
        Garden,
        SortingStation
    }

    [RequireComponent(typeof(Collider2D))]
    public class ReclaimHotspot : MonoBehaviour
    {
        [SerializeField] private HotspotType hotspotType;

        public HotspotType Type
        {
            get => hotspotType;
            set => hotspotType = value;
        }

        private void OnMouseDown()
        {
            TriggerInteraction();
        }

        private void OnTriggerEnter2D(Collider2D other)
        {
            if (other.name == "Character" || other.CompareTag("Player"))
            {
                TriggerInteraction();
            }
        }

        public void TriggerInteraction()
        {
            var room = Object.FindAnyObjectByType<ReclaimRoom>();
            if (room == null) return;

            switch (hotspotType)
            {
                case HotspotType.ArtGallery:
                    room.SelectArtGallery();
                    break;
                case HotspotType.Garden:
                    room.SelectGarden();
                    break;
                case HotspotType.SortingStation:
                    room.SelectSortingPractice();
                    break;
            }
        }
    }
}