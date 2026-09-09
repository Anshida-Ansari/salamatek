export async function translateText(text: string, from = 'en', to = 'ar'): Promise<string> {
  if (!text || text.trim() === '') return '';
  
  try {
    // Use Google Translate's free API endpoint for much better accuracy and name transliteration
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    // The response is a nested array. We map over the first array to combine the translated parts.
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((item: any) => item[0]).join('');
    }
    
    return text; // fallback
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // fallback to original
  }
}
