const API_SERVER = 'http://localhost:8081/api'
const SSE_SERVER = 'http://localhost:8081/sse'

export const API_ROUTES = {
    farmRoutes: `${API_SERVER}/farms`,
    hiveRoutes: `${API_SERVER}/hives`,
    sensorRoutes: `${API_SERVER}/sensors`,
    alertRoutes: `${API_SERVER}/alerts`,
    metricRoutes: `${API_SERVER}/metrics`,
    harvestRoutes: `${API_SERVER}/harvest`,
}

export const SSE_ROUTES = {
    alertRoutes: `${SSE_SERVER}/alerts`
}
