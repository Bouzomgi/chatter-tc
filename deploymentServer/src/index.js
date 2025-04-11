const express = require("express");
const { authenticateToken } = require("./authenticateToken");
const { deployBlack, switchTraffic, destroyBlack } = require("./core");

const app = express();
const PORT = process.env.PORT || 8000;

// health check route
app.get("/deployment/health", (req, res) => {
  return res.status(200).send("The deployment server is ok");
});

if (process.env.AUTH_TOKEN != undefined) {
  app.use(authenticateToken);
}

////////// FRONTEND ROUTES //////////

// stand up new test env
app.get("/deployment/frontend/deployBlack", async (req, res) => {
  try {
    const tag = req.query.tag || "latest";

    await deployBlack("frontend", tag);

    return res
      .status(200)
      .send("Successfully set up frontend black environment");
  } catch (err) {
    return res
      .status(400)
      .send(`Failed to set up frontend black environment: ${err.message}`);
  }
});

// switch traffic from current env to next and destroy black env
app.get("/deployment/frontend/switchTraffic", async (_, res) => {
  try {
    await switchTraffic("frontend");

    return res.status(200).send("Successfully switched frontend traffic");
  } catch (err) {
    return res
      .status(400)
      .send(`Failed to switch frontend traffic: ${err.message}`);
  }
});

// destroy black env
app.get("/deployment/frontend/destroyBlack", async (_, res) => {
  try {
    await destroyBlack("frontend");

    return res.status(200).send("Successfully destroyed frontend black");
  } catch (err) {
    return res
      .status(400)
      .send(`Failed to destroy frontend black: ${err.message}`);
  }
});

////////// BACKEND ROUTES //////////

// stand up new test env
app.get("/deployment/backend/deployBlack", async (req, res) => {
  try {
    const tag = req.query.tag || "latest";

    await deployBlack("backend", tag);

    return res
      .status(200)
      .send("Successfully set up backend black environment");
  } catch (err) {
    return res
      .status(400)
      .send(`Failed to set up backend black environment: ${err.message}`);
  }
});

// switch traffic from current env to next and destroy black env
app.get("/deployment/backend/switchTraffic", async (_, res) => {
  try {
    await switchTraffic("backend");

    return res.status(200).send("Successfully switched backend traffic");
  } catch (err) {
    return res
      .status(400)
      .send(`Failed to switch backend traffic: ${err.message}`);
  }
});

// destroy black env
app.get("/deployment/backend/destroyBlack", async (_, res) => {
  try {
    await destroyBlack("backend");

    return res.status(200).send("Successfully destroyed backend black");
  } catch (err) {
    return res
      .status(400)
      .send(`Failed to destroy backend black: ${err.message}`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
