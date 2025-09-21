# core/ai_model/extractor.py

from core.models import ExtractedMedicine
import easyocr
import re
from fuzzywuzzy import fuzz, process

class MedicineExtractor:
    """Extract medicines from image using EasyOCR + Fuzzy matching with DB"""
    def __init__(self):
        self.ocr = easyocr.Reader(['en'])
        self.medicine_names = list(ExtractedMedicine.objects.values_list('name', flat=True))
        self.medicine_patterns = [
            r'\b[A-Z][a-z]+(?:olol|pril|sartan|statin|cillin|mycin|oxacin)\b',
            r'\b[A-Z][a-z]{3,}\b',
            r'\b\d+\s*mg\b',
        ]

    def extract_medicines_from_image(self, image_path):
        results = self.ocr.readtext(image_path)
        ocr_texts = [(text, conf) for (_, text, conf) in results]

        potential = self.extract_potential_medicines(ocr_texts)
        matched = self.match_medicines_fuzzy(potential)
        return matched

    def extract_potential_medicines(self, text_results):
        potential_meds = []
        for text, conf in text_results:
            cleaned = re.sub(r'[^\w\s]', '', text)
            for word in cleaned.split():
                if len(word) > 3:
                    for pattern in self.medicine_patterns:
                        if re.search(pattern, word, re.IGNORECASE):
                            potential_meds.append((word, conf))
                            break
        return potential_meds

    def match_medicines_fuzzy(self, potential_meds):
        matched = []
        for med_text, conf in potential_meds:
            # Try exact match in DB
            try:
                medicine = ExtractedMedicine.objects.get(name__icontains=med_text)
                medicine.confidence = conf
                matched.append(medicine)
            except ExtractedMedicine.DoesNotExist:
                # Fuzzy match
                best = process.extractOne(med_text, self.medicine_names, scorer=fuzz.token_sort_ratio, score_cutoff=70)
                if best:
                    name, score = best
                    medicine = ExtractedMedicine.objects.get(name=name)
                    medicine.confidence = (conf + score/100)/2
                    matched.append(medicine)

        # Remove duplicates by name, keep highest confidence
        unique = {}
        for med in matched:
            if med.name not in unique or med.confidence > unique[med.name].confidence:
                unique[med.name] = med
        return list(unique.values())
