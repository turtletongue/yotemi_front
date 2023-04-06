"use client";

import { GroupBase } from "react-select";
import Creatable, { CreatableProps } from "react-select/creatable";
import {
  ComponentProps,
  UseAsyncPaginateParams,
  withAsyncPaginate,
} from "react-select-async-paginate";
import { ReactElement } from "react";

type AsyncPaginateCreatableProps<
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean
> = CreatableProps<OptionType, IsMulti, Group> &
  UseAsyncPaginateParams<OptionType, Group, Additional> &
  ComponentProps<OptionType, Group, IsMulti>;

type AsyncPaginateCreatableType = <
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean = false
>(
  props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>
) => ReactElement;

export default withAsyncPaginate(Creatable) as AsyncPaginateCreatableType;
