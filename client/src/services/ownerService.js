const API = "https://charge-connect.onrender.com/api/station-owner";

// Register

export async function registerOwner(data) {

  const response = await fetch(`${API}/register`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),

  });

  return response.json();

}

// Login

export async function loginOwner(email, password) {

  const response = await fetch(`${API}/login`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),

  });

  return response.json();

}

// Profile

export async function getOwnerProfile(id) {

  const response = await fetch(`${API}/profile/${id}`);

  return response.json();

}

// Update

export async function updateOwner(id, data) {

  const response = await fetch(`${API}/update/${id}`, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),

  });

  return response.json();

}