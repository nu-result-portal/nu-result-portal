const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return jsonResponse({
        status: "ok",
        project: "NU Result & CGPA Portal",
        officialIntegration: false,
        message: "Backend is running. Official result integration is not configured.",
      });
    }

    if (url.pathname === "/api/result" && request.method === "POST") {
      let body;

      try {
        body = await request.json();
      } catch {
        return jsonResponse({
          error: "Invalid JSON request.",
        }, 400);
      }

      const allowedCourses = [
        "honours",
        "degree",
        "masters",
        "professional",
      ];

      const course = String(body.course || "").toLowerCase();
      const roll = String(body.roll || "").trim();
      const registration = String(body.registration || "").trim();
      const year = String(body.year || "").trim();

      if (
        !allowedCourses.includes(course) ||
        !roll ||
        !registration ||
        !/^\d{4}$/.test(year)
      ) {
        return jsonResponse({
          error: "Please provide a valid course, roll, registration and four-digit exam year.",
        }, 400);
      }

      return jsonResponse({
        status: "not_configured",
        message: "Official NU result integration is not configured. No result was retrieved.",
        officialPortal: "https://results.nu.ac.bd/",
      }, 501);
    }

    return jsonResponse({
      error: "Endpoint not found.",
    }, 404);
  },
};
