import { useEffect, useState } from "react";

import { Topic, useGetTopicQuery } from "@redux/features/topics";
import { Language } from "@app/i18n/client";
import { axiosInstance } from "@utils";
import { Id } from "@app/declarations";

const useTopicsSelect = (
  lang: Language,
  currentTopicId?: Id | null,
  exclude?: Id[]
) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const topicsMap = topics.reduce(
    (map, topic) => ({ ...map, [topic.id]: topic }),
    {}
  ) as Record<Id, Topic>;

  const { data: currentTopic } = useGetTopicQuery(currentTopicId!, {
    skip: !currentTopicId,
  });

  useEffect(() => {
    if (currentTopic) {
      setTopics((topics) => [...topics, currentTopic]);
    }
  }, [currentTopic]);

  const topicToOption = (topic: Topic) => ({
    value: topic.id,
    label: topic.labels.find((label) => label.language === lang)?.value ?? "",
  });
  const topicIdToOption = (topicId: Id | null) => {
    if (!topicId) {
      return null;
    }

    const topic = topicsMap[topicId];

    if (!topic) {
      return null;
    }

    return topicToOption(topic);
  };

  const topicsLoader = async (
    search: string,
    loadedOptions: unknown,
    { page = 1 } = {}
  ) => {
    const { data } = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/topics`,
      {
        params: {
          page,
          ...(search && {
            label: search,
          }),
        },
      }
    );

    const loadedTopics = data.items.filter(
      ({ id }: { id: Id }) => !exclude?.includes(id)
    );

    setTopics((topics) => [...topics, ...loadedTopics]);

    return {
      options: loadedTopics.map((topic: Topic) => topicToOption(topic)),
      hasMore: page < data.totalPages,
      additional: {
        page: page + 1,
      },
    };
  };

  return {
    topicsLoader,
    topicsMap,
    topicIdToOption,
    defaultTopics: topics.map(topicToOption),
  };
};

export default useTopicsSelect;
