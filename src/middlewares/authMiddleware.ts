// import { Request, Response, NextFunction } from "express";
// import { auth } from "../lib/auth";
// import { fromNodeHeaders } from "better-auth/node";

// // Extend Express Request to carry the authenticated user
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         name: string;
//         email: string;
//         role: string;
//       };
//     }
//   }
// }

// /**
//  * Validates the session cookie / Authorization header via better-auth.
//  * Attaches `req.user` on success, returns 401 otherwise.
//  */
// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const session = await auth.api.getSession({
//       headers: fromNodeHeaders(req.headers),
//     });

//     if (!session?.user) {
//       res.status(401).json({ success: false, message: "Unauthorized: please sign in" });
//       return;
//     }

//     req.user = {
//       id: session.user.id,
//       name: session.user.name,
//       email: session.user.email,
//       role: (session.user as any).role ?? "USER",
//     };

//     next();
//   } catch {
//     res.status(401).json({ success: false, message: "Unauthorized: invalid session" });
//   }
// };

// /**
//  * Role-based access guard. Use after authMiddleware.
//  * Example: authorizeRoles("SUPERADMIN", "ADMIN")
//  */
// export const authorizeRoles = (...roles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       res.status(403).json({
//         success: false,
//         message: `Forbidden: requires one of [${roles.join(", ")}]`,
//       });
//       return;
//     }
//     next();
//   };
// };
