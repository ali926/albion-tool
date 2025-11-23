import axios from "axios";

export async function fetchRecipe(itemId) {
    // AODP recipe API
    const url = `https://europe.albiononline2d.com/api/item/${itemId}`;

    const { data } = await axios.get(url);

    if (!data || !data[0] || !data[0].recipe) return null;

    return data[0].recipe;
}
