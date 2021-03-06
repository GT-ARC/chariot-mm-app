export const environment = {
  version: "1.4",
  production: true,
  databaseUrl: 'http://chariot-km.dai-lab.de:8080/v1/',
  monitoringServiceURL: 'http://chariot-km.dai-lab.de:8080/v1/monitoringservice/',
  serviceUrl: 'http://chariot-km.dai-lab.de:8080/v1/services?format=json',
  proxyAgentAddress: 'http://chariot-main.dai-lab.de:8080/chariot/sendAction',
  http_retries: 3,
  icons: {
    error: "error",
    warning: "warning"
  }
};
