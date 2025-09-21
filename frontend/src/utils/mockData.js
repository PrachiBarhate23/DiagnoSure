export const getMockResponse = () => {
  return {
    "id": "response-" + Date.now(),
    "plain_text_summary": "Based on your symptoms of persistent cough and sore throat for 3 days with low-grade fever and body aches, you may be experiencing a common cold or viral upper respiratory infection. These symptoms typically resolve within 7-10 days with proper rest and hydration.",
    "potential_conditions": [
      {
        "name": "Common Cold",
        "confidence": 0.85,
        "insights": "A viral infection of your nose and throat (upper respiratory tract). It's usually harmless, although it might not feel that way.",
        "evidence_links": [
          {"label": "Mayo Clinic - Common Cold", "url": "https://mayoclinic.org/diseases-conditions/common-cold"},
          {"label": "WebMD - Cold Symptoms", "url": "https://webmd.com/cold-and-flu/cold-symptoms"}
        ]
      },
      {
        "name": "Influenza (Flu)",
        "confidence": 0.60,
        "insights": "A contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.",
        "evidence_links": [
          {"label": "CDC - Flu Symptoms", "url": "https://cdc.gov/flu/symptoms"},
          {"label": "WHO - Influenza", "url": "https://who.int/news-room/fact-sheets/detail/influenza"}
        ]
      },
      {
        "name": "Acute Bronchitis",
        "confidence": 0.40,
        "insights": "An inflammation of the lining of your bronchial tubes, which carry air to and from your lungs.",
        "evidence_links": [
          {"label": "American Lung Association", "url": "https://lung.org/lung-health-diseases/lung-disease-lookup/acute-bronchitis"}
        ]
      }
    ],
    "medical_research": [
      {
        "title": "Effectiveness of Zinc Supplementation in Common Cold Treatment",
        "summary": "A systematic review showed that zinc lozenges may reduce the duration of common cold symptoms when taken within 24 hours of onset.",
        "link": "https://doi.org/10.1002/14651858.CD001364.pub4"
      },
      {
        "title": "Viral Upper Respiratory Tract Infections: Epidemiology and Treatment",
        "summary": "An inflammation of the lining of your bronchial tubes, which carry air to and from your lungs.",
        "link": "https://doi.org/10.1016/j.pcl.2018.07.003"
      },
      {
        "title": "Honey for Acute Cough in Children",
        "summary": "Clinical trials demonstrate honey's effectiveness in reducing nocturnal cough and improving sleep quality in children with upper respiratory infections.",
        "link": "https://doi.org/10.1002/14651858.CD007094.pub5"
      }
    ],
    "past_case_studies": [
      {
        "case_id": "CS-2023-1047",
        "short_summary": "A viral infection of your nose and throat (upper respiratory tract). It's usually harmless.",
        "link": "https://example.com/case-studies/cs-2023-1047"
      },
      {
        "case_id": "CS-2023-0892",
        "short_summary": "Patient with similar presentation recovered completely after 8 days with supportive care and adequate hydration.",
        "link": "https://example.com/case-studies/cs-2023-0892"
      },
      {
        "case_id": "CS-2023-0654",
        "short_summary": "Adult patient with persistent cough and fever responded well to symptomatic treatment and returned to normal activities within one week.",
        "link": "https://example.com/case-studies/cs-2023-0654"
      }
    ],
    "confidence_overall": 0.68,
    // Always include audio URL for demo purposes
    "tts_audio_url": "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  };
};