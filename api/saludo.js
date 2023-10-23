export default async function handler(request, response) {
    // const snapshot = await db.collection(collectionName).get();
    // console.log(snapshot)
    response.status(200).json({
      body: request.body,
      query: request.query,
      cookies: request.cookies,
    });
  }