const { exec } = require("child_process");

const runAnsiblePlaybook = async (env, testRoute, tag) => {
  return new Promise((resolve, reject) => {
    const command = `ansible-playbook /app/server/render_nginx_template.yaml -e "red_env=${env}" -e "enable_test_route=${testRoute}" --tags ${tag}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error.message);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(
        `Ran ansible playbook with red_env=${env} and enable_test_route=${testRoute}`
      );
      resolve(stdout);
    });
  });
};

const runBackendPlaybook = (env, testRoute) =>
  runAnsiblePlaybook(env, testRoute, "backend");

module.exports = {
  runBackendPlaybook,
};
