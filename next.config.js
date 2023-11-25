/** @type {import('next').NextConfig} */
const nextConfig = {};
// const nextConfig = {
//   async redirects() {
//     return [
//       {
//         source: "/",
//         has: [
//           {
//             type: "query",
//             key: "remoteID",
//             // the page value will not be available in the
//             // destination since value is provided and doesn't
//             // use a named capture group e.g. (?<page>home)
//             // value: "home",
//           },
//         ],
//         destination: "/monitor",
//         permanent: false,
//       },
//     ];
//   },
// };

module.exports = nextConfig;
