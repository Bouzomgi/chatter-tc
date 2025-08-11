const { findCurrentRed, getAlternateEnv } = require("./utils/configParsing");

const {
  createDockerContainer,
  destroyDockerContainer,
  restartNginx,
  doesContainerExist,
} = require("./utils/docker");

const { runBackendPlaybook } = require("./utils/ansible");

const backendNginxRoute = "/etc/nginx/conf.d/backend.conf";
const imageName = "micro-server";
const networkName = "app-network";

const validateEnvironment = (env) => {
  if (env != "backend" && env != "frontend")
    throw new Error("Deployment called on neither frontend nor backend");
};

const deployBlack = async (env, tag) => {
  validateEnvironment(env);

  const currentRed = await findCurrentRed(backendNginxRoute);
  const currentBlack = getAlternateEnv(currentRed);
  const blackContainerName = `${env}-${currentBlack}`;

  const doesBlackExist = await doesContainerExist(blackContainerName);
  if (doesBlackExist) {
    throw new Error("Black is already up");
  }

  await createDockerContainer(imageName, tag, blackContainerName, networkName);

  if (env == "backend") {
    await runBackendPlaybook(currentRed, true);
  }

  await restartNginx();
};

const switchTraffic = async (env) => {
  validateEnvironment(env);

  const currentRed = await findCurrentRed(backendNginxRoute);
  const currentBlack = getAlternateEnv(currentRed);

  const redContainerName = `${env}-${currentRed}`;
  const blackContainerName = `${env}-${currentBlack}`;

  const doesBlackExist = await doesContainerExist(blackContainerName);
  if (!doesBlackExist) {
    throw new Error("Black is not up");
  }

  if (env == "backend") {
    await runBackendPlaybook(currentBlack, false);
  }
  await restartNginx();
  // red is now the new black
  await destroyDockerContainer(redContainerName);
};

const destroyBlack = async (env) => {
  validateEnvironment(env);

  const currentRed = await findCurrentRed(backendNginxRoute);
  const currentBlack = getAlternateEnv(currentRed);
  const blackContainerName = `${env}-${currentBlack}`;

  const doesBlackExist = await doesContainerExist(blackContainerName);
  if (!doesBlackExist) {
    throw new Error("Black is not up");
  }

  if (env == "backend") {
    await runBackendPlaybook(currentRed, false);
  }
  await restartNginx();
  await destroyDockerContainer(blackContainerName);
};

module.exports = {
  deployBlack,
  switchTraffic,
  destroyBlack,
};
