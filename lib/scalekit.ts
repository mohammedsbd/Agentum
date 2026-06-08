import { Scalekit } from "@scalekit-sdk/node";

export class ScalekitConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScalekitConfigError";
  }
}

let scalekitClient: Scalekit | null = null;

const requiredEnv = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new ScalekitConfigError(`${name} is required for Scalekit auth.`);
  }

  return value;
};

const getEnvironmentUrl = () => {
  const rawValue = requiredEnv("SCALEKIT_ENVIRONMENT_URL");
  const value = /^https?:\/\//i.test(rawValue) ? rawValue : `https://${rawValue}`;

  try {
    return new URL(value).origin;
  } catch {
    throw new ScalekitConfigError(
      "SCALEKIT_ENVIRONMENT_URL must be a valid URL, for example https://your-env.scalekit.dev."
    );
  }
};

export const getScalekit = () => {
  if (!scalekitClient) {
    scalekitClient = new Scalekit(
      getEnvironmentUrl(),
      requiredEnv("SCALEKIT_CLIENT_ID"),
      requiredEnv("SCALEKIT_CLIENT_SECRET")
    );
  }

  return scalekitClient;
};

const scalekit = new Proxy({} as Scalekit, {
  get(_target, property) {
    const client = getScalekit();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export default scalekit;
