import { useEffect, useState } from "react";
import { LoadingPlaceholder, Table, useTheme2 } from "@grafana/ui";
import {
  toDataFrame,
  applyFieldOverrides,
  DataFrame,
  FieldType,
  MutableDataFrame,
  ThresholdsMode
} from "@grafana/data";

export default function SimplePanel(props) {
  const [data, setData] = useState(null);
  const theme = useTheme2();

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {

        let dataFrame = toDataFrame(data.products);

        const configOverrides = {
          rating: {
            custom: {
              displayMode: 'gradient-gauge',
            },
            min: 0,
            max: 5
          },
          thumbnail: {
            custom: {
              displayMode: 'image'
            }
          }
        }

        for (const field of dataFrame.fields) {
          field.config = { ...field.config, ...configOverrides[field.name] };
        }
        setData(applyFieldOverrides({
          data: [dataFrame],
          fieldConfig: {
            overrides: [],
            defaults: {},
          }, replaceVariables: (value: string) => value,
          theme
        })[0])

      })
      .catch((e) => {
        // catch errors and handle
      });
  }, []);

  return (
    <>
      {data ? (
        <div className="panel-container" style={{ width: 'auto' }}>
          <Table {...props} data={data} />
        </div>
      ) : (
          <LoadingPlaceholder />
        )}
    </>
  );
}
