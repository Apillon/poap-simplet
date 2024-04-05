import { Identity } from "@apillon/sdk";
import { Application } from "express";
import { RouteErrorCode } from "../config/values";
import { NextFunction, Request, Response } from "../http";
import { ResourceError } from "../lib/errors";
import { generateAdminAuthToken } from "../lib/jwt";

/**
 * Installs new route on the provided application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.post("/login", (req: Request, res: Response, next: NextFunction) => {
    resolve(req, res).catch(next);
  });
}

export async function resolve(req: Request, res: Response): Promise<void> {
  const { context, body } = req;

  if (!body.signature) {
    throw new ResourceError(RouteErrorCode.SIGNATURE_NOT_PRESENT);
  }

  if (!context.env.ADMIN_WALLET.includes(body.address?.toLowerCase())) {
    throw new ResourceError(RouteErrorCode.INVALID_ADMIN, context);
  }

  const identity = new Identity(null);

  const { isValid } = await identity.validateEvmWalletSignature({
    walletAddress: body.address,
    signature: body.signature,
    signatureValidityMinutes: 10,
    message: `test\n${body.timestamp}`,
    timestamp: body.timestamp,
  });

  if (isValid) {
    const jwt = generateAdminAuthToken(body.address);
    return res.respond(200, { jwt });
  } else {
    throw new ResourceError(RouteErrorCode.USER_DOES_NOT_EXIST, context);
  }
}
