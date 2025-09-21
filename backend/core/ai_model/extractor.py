# core/ai_model/extractor.py

from core.models import ExtractedMedicine

class MedicineExtractor:
    """
    Dummy extractor that returns hardcoded medicines.
    This avoids OCR dependencies (EasyOCR, fuzzy matching).
    Replace this later if real OCR is needed.
    """

    def __init__(self):
        # Load medicine names from DB for reference
        self.medicine_names = list(
            ExtractedMedicine.objects.values_list('name', flat=True)
        )

    def extract_medicines_from_image(self, image_path=None):
        """
        Instead of OCR, return hardcoded or DB-based medicines.
        """
        # Example: pretend the image always contains Paracetamol 500mg
        try:
            med = ExtractedMedicine.objects.get(name__icontains="Paracetamol")
            med.confidence = 1.0  # 100% since it's hardcoded
            return [med]
        except ExtractedMedicine.DoesNotExist:
            return []

    # Keeping API compatibility with old methods
    def extract_potential_medicines(self, text_results):
        return []

    def match_medicines_fuzzy(self, potential_meds):
        return []
