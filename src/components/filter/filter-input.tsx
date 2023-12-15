"use client";

import { useMemo, useState } from "react";
import { BlankIcon } from "./icons/blank";
import { ContainsIcon } from "./icons/contains";
import { EqualsIcon } from "./icons/equals";
import Select, { SingleValue, StylesConfig, ThemeConfig } from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputType, QueryType } from "./filter-consts";

export type SelectItem = SingleValue<{
  label: string;
  value: any;
  valueDisplay?: string;
}>;

export interface FilterInputOption {
  label: string;
  accessor: string;
  input: InputType;
  options?: SelectItem[];
  queries: QueryType[];
  valueTransformer?: (value: string | SelectItem, query?: QueryType) => any;
}

export interface FilterValue {
  label: string;
  accessor: string;
  query: QueryType;
  value: string | SelectItem;
  valueDisplay?: string;
  transformedValue?: any;
}

interface FilterInputProps {
  options: FilterInputOption[];
  onSubmit: (value: FilterValue) => void;
}

const getQueryIcon = (type?: QueryType) => {
  const style = {
    fill: "#fff",
    width: "14px",
    height: "14px",
  };

  switch (type) {
    case QueryType.CONTAINS: {
      return <ContainsIcon style={style} />;
    }
    case QueryType.EQUALS: {
      return <EqualsIcon style={style} />;
    }
    default:
      return <BlankIcon style={style} />;
  }
};

const FilterInput = ({ options, onSubmit }: FilterInputProps) => {
  const [selectedOption, setSelectedOption] = useState<
    FilterInputOption | undefined
  >(undefined);
  const [textInputValue, setTextInputValue] = useState("");
  const [selectInputValue, setSelectInputValue] = useState<
    SelectItem | undefined
  >(undefined);
  const [query, setQuery] = useState<QueryType>();

  const selectStyles: StylesConfig<SelectItem, false> = useMemo(
    () => ({
      option: provided => ({
        ...provided,
        fontSize: "12px",
        padding: "6px 12px",
        ["&:hover"]: {
          backgroundColor: "hsla(240,3%,11%,1)",
        },
      }),
      container: provided => ({
        ...provided,
        width: "100%",
      }),
      control: provided => ({
        ...provided,
        borderColor: "hsl(240,3.7%,15.9%)",
        fontSize: "12px",
        width: "100%",
        minHeight: "33px",
        backgroundColor: "hsl(240 5.9% 10%)",
        ["&:hover"]: {
          borderColor: "hsl(240,3.7%,15.9%)",
        },
      }),
      input: provided => ({ ...provided, margin: 0 }),
      noOptionsMessage: provided => ({ ...provided, fontSize: "12px" }),
      dropdownIndicator: provided => ({
        ...provided,
        paddingBlock: 0,
      }),
      singleValue: provided => ({
        ...provided,
        color: "#fff",
      }),
      menuList: provided => ({
        ...provided,
        backgroundColor: "hsla(240,10%,3.9%,1)",
      }),
    }),
    [],
  );

  const selectTheme: ThemeConfig = selectTheme => ({
    ...selectTheme,
    colors: {
      ...selectTheme.colors,
      primary: "hsla(240,5.9%,10%,1)",
      primary75: "hsla(240,5.9%,10%,0.75)",
      primary50: "hsla(240,5.9%,10%,0.5)",
      primary25: "hsla(240,5.9%,10%,0.25)",
    },
  });

  const value = useMemo(
    () =>
      selectedOption?.input === InputType.TEXT
        ? textInputValue
        : selectedOption?.input === InputType.SELECT
          ? selectInputValue ?? ""
          : null,
    [selectedOption, selectInputValue, textInputValue],
  );

  return (
    <div className="flex flex-col gap-1 overflow-visible">
      <div className="flex flex-nowrap gap-2 overflow-visible">
        <Select
          styles={selectStyles}
          theme={selectTheme}
          options={options.map(({ label, accessor }) => ({
            label,
            value: accessor,
          }))}
          onChange={val => {
            const option = options.find(item => item.accessor === val?.value);

            setSelectedOption(option);
            setQuery(option?.queries[0]);
          }}
          placeholder="Select"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-min min-h-[33px] w-[30px] rounded-sm p-0"
              disabled={!selectedOption}
              variant="outline"
            >
              {getQueryIcon(query)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {selectedOption?.queries.map((query, index) => (
              <DropdownMenuItem onClick={() => setQuery(query)} key={index}>
                <div className="flex items-center">
                  <div>{getQueryIcon(query)}</div>
                  <div className="text-sm">{query}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {selectedOption ? (
          <>
            {selectedOption.input === InputType.TEXT && (
              <Input
                placeholder="Enter value"
                value={textInputValue}
                onChange={event => setTextInputValue(event.currentTarget.value)}
                className="h-min min-h-[33px] text-xs"
              />
            )}
            {selectedOption.input === InputType.SELECT && (
              <Select
                placeholder="Select value"
                theme={selectTheme}
                styles={selectStyles}
                options={selectedOption?.options || []}
                onChange={val => {
                  setSelectInputValue(val!);
                }}
                value={selectInputValue}
              />
            )}
          </>
        ) : (
          <Input disabled className="h-min min-h-[33px] text-xs" />
        )}
      </div>
      <Button
        size="sm"
        className="flex-1 py-2 text-xs"
        variant="outline"
        onClick={() => {
          if (selectedOption) {
            onSubmit({
              label: selectedOption.label,
              accessor: selectedOption.accessor,
              ...(selectedOption.input === InputType.SELECT
                ? {
                    valueDisplay: selectedOption.options?.find(
                      item => item?.value === value,
                    )?.label,
                  }
                : {}),
              value:
                selectedOption.input === InputType.TEXT
                  ? textInputValue
                  : selectedOption.input === InputType.SELECT
                    ? selectInputValue ?? ""
                    : "",
              ...(selectedOption.valueTransformer && !!value
                ? {
                    transformedValue: selectedOption.valueTransformer(
                      value,
                      query,
                    ),
                  }
                : {}),
              query: query!,
            });
          }
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export { FilterInput };
