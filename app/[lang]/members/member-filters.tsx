"use client";

import { ChangeEvent } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { TextInput } from "flowbite-react";
import { Search } from "react-feather";
import Select from "react-select";

import { Topic } from "@components";
import { useAppDispatch, useAppSelector } from "@redux/store-config/hooks";
import {
  addTopic,
  removeTopic,
  selectOrderBy,
  selectSearchFilter,
  selectTopicsFilter,
  setOrderBy,
  setSearch,
} from "@redux/features/users";
import useTopicsSelect from "@hooks/use-topics-select";
import { Language, useTranslation } from "@app/i18n/client";
import { Id } from "@app/declarations";

interface MemberFiltersProps {
  lang: Language;
}

const MemberFilters = ({ lang }: MemberFiltersProps) => {
  const { translation } = useTranslation(lang, "members-filter");
  const dispatch = useAppDispatch();

  /* Topics filter */

  const selectedTopics = useAppSelector(selectTopicsFilter);

  const { topicsLoader, topicsMap } = useTopicsSelect(
    lang,
    null,
    selectedTopics.map(({ id }) => id)
  );

  const addTopicFilter = (id?: Id) => {
    if (!id) {
      return;
    }

    dispatch(addTopic(topicsMap[id]));
  };

  const deleteTopicFilter = (id: Id) => {
    dispatch(removeTopic(id));
  };

  /* Search */

  const search = useAppSelector(selectSearchFilter);

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(event.target.value));
  };

  /* Sorting */
  const orderBy = useAppSelector(selectOrderBy);

  const sortingOptions = [
    { label: translation("orderByRating"), value: "rating" },
    { label: translation("orderByActivity"), value: "activity" },
  ];

  const onSortingChange = (option: { value: string } | null) => {
    if (option) {
      dispatch(setOrderBy(option.value as "rating" | "activity"));
    }
  };

  return (
    <div className="my-12 w-full flex flex-col-reverse gap-4 lg:flex-row justify-center md:justify-between mx-auto max-w-screen-[2100px]">
      <div className="flex flex-col gap-4 w-full sm:w-1/2 justify-center">
        <AsyncPaginate
          name="topicsSelect"
          value={null}
          onChange={(option: { value: Id } | null) =>
            addTopicFilter(option?.value)
          }
          loadOptions={topicsLoader}
          additional={{ page: 1 }}
          className="text-gray-500 text-sm lg:grow-0 lg:w-36 xl:w-48 2xl:w-64 mr-2 min-w-[15rem] w-full sm:w-fit"
          placeholder={translation("filterByTopicPlaceholder")}
          debounceTimeout={250}
          isClearable
          cacheUniqs={[selectedTopics.length]}
        />
        {selectedTopics.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {selectedTopics.map((topic) => (
              <div key={topic.id} className="h-fit">
                <Topic
                  colorHex={topic.colorHex}
                  deletable
                  showDeleteAlways
                  onDelete={() => deleteTopicFilter(topic.id)}
                  lang={lang}
                  labels={topic.labels}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <TextInput
          type="search"
          name="searchTopics"
          id="searchTopics"
          className="h-fit w-full sm:w-fit"
          value={search}
          onChange={onSearchChange}
          placeholder={translation("filterByTextPlaceholder") ?? ""}
          rightIcon={Search}
        />
        <Select
          value={sortingOptions.find((option) => option.value === orderBy)}
          options={sortingOptions}
          onChange={onSortingChange}
          className="text-gray-500 text-sm lg:grow-0 lg:w-36 xl:w-48 min-w-[15rem] w-full sm:w-fit"
        />
      </div>
    </div>
  );
};

export default MemberFilters;
