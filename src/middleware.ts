import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
	matcher: createRouteMatcher([route]),
	allowedRoles: routeAccessMap[route],
}));

console.log(matchers);

export default clerkMiddleware((auth, req) => {
	// if (isProtectedRoute(req)) auth().protect()

	const { sessionClaims } = auth();

	const role = (sessionClaims?.metadata as { role?: string })?.role;

	for (const { matcher, allowedRoles } of matchers) {
		if (matcher(req) && !allowedRoles.includes(role!)) {
			return NextResponse.redirect(new URL(`/${role}`, req.url));
		}
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// import { routeAccessMap } from "./lib/settings";
// import { NextResponse } from "next/server";

// const matchers = Object.keys(routeAccessMap).map((route) => ({
// 	matcher: createRouteMatcher([route]),
// 	allowedRoles: routeAccessMap[route],
// }));

// console.log(matchers);

// export default clerkMiddleware((auth, req) => {
// 	const { sessionClaims } = auth();
// 	const role = (sessionClaims?.metadata as { role?: string })?.role;

// 	console.log("Session Claims_:", sessionClaims);
// 	console.log("Session Claims:", sessionClaims);
// 	console.log("Extracted Role:", role);

// 	for (const { matcher, allowedRoles } of matchers) {
// 		if (matcher(req) && !allowedRoles.includes(role || "")) {
// 			const redirectRole = role || "guest"; // Fallback role
// 			console.log(`Redirecting to: /${redirectRole}`);
// 			return NextResponse.redirect(new URL(`/${redirectRole}`, req.url));
// 		}
// 	}
// });

// export const config = {
// 	matcher: [
// 		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// 		"/(api|trpc)(.*)",
// 	],
// };

// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
// 	matcher: [
// 		// Skip Next.js internals and all static files, unless found in search params
// 		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// 		// Always run for API routes
// 		"/(api|trpc)(.*)",
// 	],
// };
