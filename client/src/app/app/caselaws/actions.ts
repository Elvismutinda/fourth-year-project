export async function getCaseLaws(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/caselaws?${query}`);
  
    if (!res.ok) {
      throw new Error("Failed to fetch case laws");
    }
  
    return res.json();
  }
  