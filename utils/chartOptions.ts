export function tooltipLabelCallback(ctx: any) {
  const total = ctx.dataset.data.reduce((cum: number, i: number) => cum += i);
  const currentValue = ctx.dataset.data[ctx.dataIndex];
  const percentage = parseFloat((currentValue/total*100).toFixed(1));
  return new Intl.NumberFormat().format(currentValue) + ' (' + percentage + '%)';
}

export function tooltipLabelCallbackCurrency(options: any) {
  return (ctx: any) => {
    const currentValue = ctx.dataset.data[ctx.dataIndex].y || ctx.dataset.data[ctx.dataIndex];
    return new Intl.NumberFormat(document.documentElement.lang, options).format(currentValue);
  }
}

export function generateChartOption(style: string) {
  switch(style) {
    case "percent":
      return {
        plugins: {
          tooltip: {
            callbacks: {
              label: tooltipLabelCallback,
            }
          }
        }
      };
    default:
      return {};
  }
}
