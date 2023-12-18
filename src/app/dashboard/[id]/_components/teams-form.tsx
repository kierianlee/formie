"use client";

import { getTeams } from "@/actions/get-teams";
import { setFormTeams } from "@/actions/set-form-teams";
import { Team } from "@/db/schema";
import { useMounted } from "@/hooks/use-mounted";
import { isEqual } from "lodash";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import Select, {
  MultiValue,
  SingleValue,
  StylesConfig,
  ThemeConfig,
} from "react-select";
import { useAsyncEffect } from "use-async-effect";

export type SelectItem = SingleValue<{
  label: string;
  value: any;
  valueDisplay?: string;
}>;

interface TeamsFormProps {
  formId: string;
  defaultTeamIds: string[];
}

const TeamsForm = ({ formId, defaultTeamIds }: TeamsFormProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    MultiValue<SelectItem>
  >([]);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const { hasMounted } = useMounted();

  const selectStyles: StylesConfig<SelectItem, true> = useMemo(
    () => ({
      option: provided => ({
        ...provided,
        fontSize: "14px",
        padding: "6px 12px",
        ["&:hover"]: {
          backgroundColor: "rgb(39,39,42)",
        },
      }),
      container: provided => ({
        ...provided,
        width: "100%",
      }),
      control: provided => ({
        ...provided,
        borderColor: "hsl(240,3.7%,15.9%)",
        fontSize: "14px",
        width: "100%",
        minHeight: "40px",
        backgroundColor: "hsl(240 3% 11%)",
        ["&:hover"]: {
          borderColor: "hsl(240,3.7%,15.9%)",
        },
      }),
      placeholder: provided => ({
        ...provided,
        color: "rgb(161, 161, 170)",
      }),
      input: provided => ({ ...provided, margin: 0, color: "hsl(0 0% 98%)" }),
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
        backgroundColor: "hsl(240 3% 11%)",
      }),
      multiValue: provided => ({
        ...provided,
        backgroundColor: "rgb(39,39,42)",
      }),
      multiValueLabel: provided => ({
        ...provided,
        color: "#fff",
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

  useAsyncEffect(async () => {
    const teams = await getTeams();

    setTeams(teams);
    setSelectedOptions(
      defaultTeamIds.map(id => {
        const team = teams.find(t => t.id === id)!;

        return {
          value: id,
          label: team.name,
        };
      }),
    );
    setOptionsLoaded(true);
  }, [defaultTeamIds]);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) return;
      if (
        isEqual(
          selectedOptions.map(s => s?.value),
          defaultTeamIds,
        )
      )
        return;
      if (!optionsLoaded) return;

      const formData = new FormData();

      formData.append(
        "teamIds",
        JSON.stringify(selectedOptions.map(o => o?.value)),
      );

      const setFormTeamsWithId = setFormTeams.bind(null, formId);

      try {
        await setFormTeamsWithId(formData);
        toast.success("Form teams updated");
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Couldn't update form teams");
        }
      }
    },
    [selectedOptions],
  );

  return hasMounted && optionsLoaded ? (
    <Select<SelectItem, true>
      styles={selectStyles}
      theme={selectTheme}
      options={teams.map(t => ({
        value: t.id,
        label: t.name,
      }))}
      instanceId="teams-form"
      isMulti={true}
      value={selectedOptions}
      onChange={setSelectedOptions}
      placeholder="Select teams to assign this form to"
    />
  ) : (
    <div className="flex min-h-[40px] items-center justify-end rounded border bg-background px-4">
      <TailSpin
        height="20"
        width="20"
        color="#4fa94d"
        ariaLabel="tail-spin-loading"
        radius="1"
      />
    </div>
  );
};

export default TeamsForm;
