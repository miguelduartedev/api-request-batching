# Interceptor for handling API request batching

## Instructions

Follow these steps to set up and run the project:

1. Clone the repository: `git clone <repository-url>`
2. Build the project: `npm run build`
3. Run the project: `npm run start`
4. Test the project: `npm run test`

## Project Structure

The project structure is as follows:

- `src/`: Contains the source code for the assignment.
- `src/__tests__/`: Includes Jest tests for the interceptor logic.

## How to test your code?

After building the project (`npm run build`), you can run the Jest test file by running `npm run test`.  
Afterward, you can also run `npm run start` and inspect your browser's console to ensure that the result of the requests provided inside index.ts are working as expected.

**Note**: If you encounter any errors in the test batch _"Test batch with fileid1, fileid2, fileid3"_, please make sure you are running a version of Node that is `18.14.2` or newer. This is a requirement due to the usage of the `.abort(reason)` method, which accepts an optional `reason` argument. This method was introduced in a later version of Node, specifically after version `16`.

## Benefits to batching requests

Batching requests is advantageous in applications where multiple API requests are expected to be made to the server. Examples of such applications include Social Media Platforms, E-commerce Applications and Analytics tools.
Here are some potential use cases and their respective benefits:

- **Optimizing Network usage**: Combining multiple API requests into a single batch reduces the amount of network calls, and therefore, reduces the overall network workload which improves performance and reduces latency.
- **Respecting API rate limits**: Many APIs restrict the number of requests that can be made. Batching requests can help us stay within the rate limits, and therefore, avoid API usage restrictions or penalties.
- **Reducing API usage costs**: Many APIs charge based on the number of requests made. Therefore batching requests can be a cost-efficient way of dealing with high-volume requests.
- **Improving Front-End performance**: In many applications, data retrieved from the back-end is used for rendering user interfaces. If each individual request triggers a separate rendering process, this will cause delays and negatively impact the perceived performance of the application. By reducing the response/request cycle time and minimizing network latency through batching requests, the risk of delays in rendering is mitigated, resulting in improved front-end performance and smoother user experience.
