// Enhanced mock data with multiple hardcoded responses based on symptom inputs

const mockResponses = {
  // Response for cough, cold, and sinus symptoms
  'cough_cold_sinus': {
    plain_text_summary: "Based on your symptoms of cough, cold, and mild sinus issues, you may be experiencing a common upper respiratory infection or seasonal allergies. These symptoms typically indicate inflammation in your nasal passages and throat. The combination of cough and sinus congestion suggests your body is responding to irritants or pathogens. Most cases resolve within 7-10 days with proper care, but persistent symptoms lasting more than two weeks may require medical evaluation.",
    tts_audio_url: "diagnosis_outputs/diagnosis_audio_20250921_112926.mp3",
    potential_conditions: [
      {
        name: "Common Cold (Viral Upper Respiratory Infection)",
        confidence: 0.75,
        insights: "Your symptoms align closely with a typical viral cold. The combination of cough, nasal congestion, and sinus pressure is characteristic of viral upper respiratory infections. These usually resolve within 7-10 days with supportive care including rest, hydration, and over-the-counter symptom relief.",
        evidence_links: [
          { label: "CDC Cold Information", url: "https://www.cdc.gov/features/rhinoviruses/index.html" },
          { label: "Mayo Clinic Guide", url: "https://www.mayoclinic.org/diseases-conditions/common-cold" }
        ]
      },
      {
        name: "Seasonal Allergic Rhinitis",
        confidence: 0.65,
        insights: "The mild sinus symptoms combined with cough could indicate seasonal allergies. Allergic rhinitis often presents with similar symptoms and can be triggered by pollen, dust, or other environmental allergens. Consider if symptoms correlate with seasonal changes or specific exposures.",
        evidence_links: [
          { label: "Allergy Foundation", url: "https://www.aafa.org/allergic-rhinitis/" },
          { label: "WebMD Allergies", url: "https://www.webmd.com/allergies/seasonal-allergies" }
        ]
      },
      {
        name: "Acute Sinusitis",
        confidence: 0.45,
        insights: "While your sinus symptoms are mild, acute sinusitis remains a possibility, especially if symptoms worsen or persist. Sinusitis typically involves facial pressure, nasal congestion, and sometimes cough from post-nasal drip.",
        evidence_links: [
          { label: "ENT Specialists", url: "https://www.entnet.org/content/sinusitis" }
        ]
      }
    ],
    medical_research: [
      {
        title: "Viral Upper Respiratory Infections: Current Understanding and Treatment Approaches",
        summary: "Recent research indicates that most upper respiratory infections are self-limiting viral conditions. Studies show that symptomatic treatment with rest, fluids, and appropriate over-the-counter medications is most effective. Antibiotics are not recommended for viral infections.",
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7152197/"
      },
      {
        title: "Seasonal Allergic Rhinitis: Diagnosis and Management Guidelines",
        summary: "Contemporary guidelines emphasize early identification of allergen triggers and appropriate use of antihistamines and nasal corticosteroids. Environmental control measures remain the first line of defense.",
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6309777/"
      }
    ],
    past_case_studies: [
      {
        case_id: "URI-2024-001",
        short_summary: "32-year-old patient with similar cold and sinus symptoms recovered fully within 8 days using supportive care including increased fluid intake, rest, and over-the-counter decongestants.",
        link: "https://example.com/case-study/uri-001"
      },
      {
        case_id: "ALL-2024-003",
        short_summary: "28-year-old with seasonal cough and sinus pressure found relief with daily antihistamines and nasal irrigation during pollen season.",
        link: "https://example.com/case-study/all-003"
      }
    ]
  },

  // Response for rashes and skin itching
  'rashes_itching': {
    plain_text_summary: "Your symptoms of rashes and skin itching suggest a dermatological condition that could range from allergic reactions to eczema or contact dermatitis. Skin rashes with itching are commonly caused by allergens, irritants, or underlying skin conditions. The pattern, location, and timing of your rash can help determine the exact cause. Most skin conditions respond well to proper skincare and topical treatments, but persistent or severe symptoms may require dermatological evaluation.",
    tts_audio_url: "diagnosis_outputs/diagnosis_audio_20250921_113638.mp3",
    potential_conditions: [
      {
        name: "Contact Dermatitis",
        confidence: 0.80,
        insights: "Contact dermatitis is a common cause of itchy rashes, occurring when skin comes into contact with irritants or allergens. This could be from soaps, detergents, plants, metals, or cosmetics. The rash typically appears where contact occurred and may include redness, swelling, and blisters.",
        evidence_links: [
          { label: "AAD Contact Dermatitis", url: "https://www.aad.org/public/diseases/eczema/types/contact-dermatitis" },
          { label: "Mayo Clinic Guide", url: "https://www.mayoclinic.org/diseases-conditions/contact-dermatitis" }
        ]
      },
      {
        name: "Atopic Dermatitis (Eczema)",
        confidence: 0.70,
        insights: "Eczema commonly presents with itchy, inflamed skin that may appear as red, scaly patches. It often affects areas like the elbows, knees, and neck. Eczema can be triggered by stress, certain foods, environmental factors, or changes in weather.",
        evidence_links: [
          { label: "National Eczema Assoc", url: "https://nationaleczema.org/eczema/" },
          { label: "NIH Eczema Info", url: "https://www.niams.nih.gov/health-topics/atopic-dermatitis" }
        ]
      },
      {
        name: "Allergic Reaction",
        confidence: 0.60,
        insights: "An allergic reaction could cause widespread itchy rashes, especially if you've been exposed to new foods, medications, or environmental allergens. Allergic reactions can range from mild skin irritation to more serious systemic reactions.",
        evidence_links: [
          { label: "ACAAI Skin Allergies", url: "https://acaai.org/allergies/allergic-conditions/skin-allergies/" }
        ]
      }
    ],
    medical_research: [
      {
        title: "Management of Chronic Itchy Skin Conditions: A Comprehensive Review",
        summary: "Recent studies highlight the importance of identifying triggers and implementing appropriate skincare routines. Topical corticosteroids and moisturizers remain first-line treatments, with newer immunomodulators showing promise for severe cases.",
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8745231/"
      },
      {
        title: "Contact Dermatitis: Identification and Avoidance of Common Allergens",
        summary: "Research emphasizes patch testing for identifying specific allergens and the importance of complete allergen avoidance. Studies show significant improvement when patients successfully identify and avoid their triggers.",
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7156142/"
      }
    ],
    past_case_studies: [
      {
        case_id: "DRM-2024-005",
        short_summary: "25-year-old patient with itchy rashes on arms and neck found relief after identifying laundry detergent as the trigger and switching to hypoallergenic products.",
        link: "https://example.com/case-study/drm-005"
      },
      {
        case_id: "ECZ-2024-008",
        short_summary: "35-year-old with recurring eczema successfully managed symptoms through consistent moisturizing routine and stress reduction techniques.",
        link: "https://example.com/case-study/ecz-008"
      }
    ]
  },

  // Response for nausea and stomach ache
  'nausea_stomach': {
    plain_text_summary: "Your symptoms of nausea and serious stomach ache indicate a gastrointestinal disturbance that could stem from various causes including food poisoning, gastroenteritis, or other digestive issues. The combination of nausea and significant abdominal pain requires attention, especially if symptoms are severe or persistent. While many gastrointestinal issues resolve on their own, severe or prolonged symptoms may indicate conditions requiring medical intervention. Stay hydrated and consider seeking medical care if symptoms worsen or include fever, severe dehydration, or persistent vomiting.",
    tts_audio_url: "diagnosis_outputs/diagnosis_audio_20250921_114646.mp3",
    potential_conditions: [
      {
        name: "Gastroenteritis (Stomach Flu)",
        confidence: 0.85,
        insights: "Gastroenteritis is characterized by inflammation of the stomach and intestines, commonly causing nausea, stomach pain, and sometimes vomiting and diarrhea. It's often caused by viral or bacterial infections and typically resolves within a few days with proper hydration and rest.",
        evidence_links: [
          { label: "CDC Gastroenteritis", url: "https://www.cdc.gov/foodsafety/foodborne-germs.html" },
          { label: "Mayo Clinic Guide", url: "https://www.mayoclinic.org/diseases-conditions/viral-gastroenteritis" }
        ]
      },
      {
        name: "Food Poisoning",
        confidence: 0.75,
        insights: "Food poisoning can cause rapid onset of nausea and stomach pain, typically occurring within hours of consuming contaminated food. Symptoms usually include stomach cramps, nausea, and sometimes vomiting. Most cases resolve within 2-3 days.",
        evidence_links: [
          { label: "FDA Food Safety", url: "https://www.fda.gov/food/consumers/food-poisoning" },
          { label: "WebMD Food Poisoning", url: "https://www.webmd.com/food-recipes/food-poisoning" }
        ]
      },
      {
        name: "Peptic Ulcer",
        confidence: 0.45,
        insights: "Peptic ulcers can cause stomach pain and nausea, especially when the stomach is empty or after eating certain foods. The pain is often described as burning or gnawing and may be accompanied by bloating and nausea.",
        evidence_links: [
          { label: "NIH Peptic Ulcers", url: "https://www.niddk.nih.gov/health-information/digestive-diseases/peptic-ulcers-stomach-ulcers" }
        ]
      }
    ],
    medical_research: [
      {
        title: "Acute Gastroenteritis: Evidence-Based Management and Prevention",
        summary: "Current research emphasizes the importance of early rehydration and appropriate fluid replacement. Studies show that oral rehydration solutions are highly effective, and most cases resolve without specific medical intervention.",
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6627159/"
      },
      {
        title: "Food-Borne Illness: Recognition and Management in Primary Care",
        summary: "Recent guidelines focus on symptom recognition and appropriate supportive care. Research indicates that most food-borne illnesses are self-limiting, but certain high-risk cases require immediate medical attention.",
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5447085/"
      }
    ],
    past_case_studies: [
      {
        case_id: "GAS-2024-012",
        short_summary: "29-year-old patient with severe nausea and stomach pain recovered within 48 hours using clear fluids, rest, and gradual reintroduction of bland foods.",
        link: "https://example.com/case-study/gas-012"
      },
      {
        case_id: "FPD-2024-007",
        short_summary: "42-year-old with suspected food poisoning symptoms improved significantly after 3 days of hydration therapy and dietary modifications.",
        link: "https://example.com/case-study/fpd-007"
      }
    ]
  }
};

// Function to determine which response to use based on input text
export const getMockResponse = (inputText = '') => {
  const input = inputText.toLowerCase();
  
  // Check for cough, cold, sinus keywords
  if (input.includes('cough') || input.includes('cold') || input.includes('sinus')) {
    return mockResponses.cough_cold_sinus;
  }
  
  // Check for rash, itching, skin keywords
  if (input.includes('rash') || input.includes('itch') || input.includes('skin')) {
    return mockResponses.rashes_itching;
  }
  
  // Check for nausea, stomach ache keywords
  if (input.includes('nausea') || input.includes('stomach') || input.includes('nauseaus')) {
    return mockResponses.nausea_stomach;
  }
  
  // Default fallback to the first response if no keywords match
  return mockResponses.cough_cold_sinus;
};