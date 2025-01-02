// LOGS
export function getLogsByMonth(logs: any[]): any {
  const currentYear = new Date().getFullYear();
  const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Deciembre'];
  const counts = new Array(12).fill(0);

  logs.forEach(log => {
    const logDate = new Date(log.date.seconds * 1000 + log.date.nanoseconds / 1000000);

    if (logDate.getFullYear() === currentYear) {
      const month = logDate.getMonth();
      counts[month]++;
    }
  });

  return {
    labels,
    datasets: [
      {
        label: 'Interacciones por mes',
        data: counts
      }
    ]
  };
}

export function getLogsByAction(logs: any[]): any {
  const actionCounts: { [key: string]: number } = {};

  logs.forEach(log => {
    const action = log.action;
    if (action) {
      actionCounts[action] = (actionCounts[action] || 0) + 1;
    }
  });
  
  return {
    labels: Object.keys(replaceKeys(actionCounts)),
    datasets: [
      {
        label: 'Cantidad de acciones',
        data: Object.values(actionCounts)
      }
    ]
  };
}

export function getLogsForCurrentMonth(logs: any[]): any {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.date.seconds * 1000 + log.date.nanoseconds / 1000000);
    return logDate.getFullYear() === currentYear && logDate.getMonth() === currentMonth;
  });

  const actionCounts: { [key: string]: number } = {};
  filteredLogs.forEach(log => {
    actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
  });
  
  return {
    labels: Object.keys(replaceKeys(actionCounts)),
    datasets: [
      {
        label: 'Cantidad de acciones este mes',
        data: Object.values(actionCounts)
      }
    ]
  };
}

export function getLogsByActionYear(logs: any[]): any {
  const currentYear = new Date().getFullYear();
  const labels = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  const actionData: { [key: string]: number[] } = {};
  uniqueActions.forEach(action => {
      actionData[action] = new Array(12).fill(0);
  });

  logs.forEach(log => {
      const logDate = new Date(log.date.seconds * 1000 + log.date.nanoseconds / 1000000);
      if (logDate.getFullYear() === currentYear) {
          const month = logDate.getMonth();
          actionData[log.action][month]++;
      }
  });

  let datasets = uniqueActions.map(action => {
      return {
          type: 'bar',
          label: action.charAt(0).toUpperCase() + action.slice(1),
          fill: true,
          data: actionData[action]
      };
  });

  datasets = replaceLabels(datasets);

  return {
      labels,
      datasets
  };
}

const labels: { [key: string]: string } = {
  "READ": "Lecturas",
  "UPDATE": "Actualizaciones",
  "DELETE": "Eliminaciones",
  "CREATE": "Creaciones"
};

function replaceKeys(input: { [key: string]: number }): { [key: string]: number } {
  const output: { [key: string]: number } = {};

  for (const key in input) {
      if (labels[key]) {
          output[labels[key]] = input[key];
      } else {
          output[key] = input[key];
      }
  }

  return output;
}

function replaceLabels(datasets: any[]): any[] {
  return datasets.map(dataset => {
      const newLabel = labels[dataset.label] || dataset.label; // Cambiar etiqueta si hay un mapeo
      return {
          ...dataset,
          label: newLabel
      };
  });
}
