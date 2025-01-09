import { paginationsDto } from "../dtos/paginations.dto";

export function paginationSolver(paginationDto: paginationsDto) {
  let { page = 0, limit = 10 } = paginationDto;
  if (!page || page <= 0) page = 1;
  else page = page - 1;

  if (!limit || limit <= 0) limit = 10;
  let skip = page * limit;

  return {
    page: page === 0 ? 1 : page + 1,
    limit,
    skip,
  };
}

export function paginationGenerator(
  count: number = 0,
  page: number = 1,
  limit: number = 10
) {
  return {
    totalcount: count,
    page: +page,
    limit: +limit,
    pageCount: Math.ceil(count / limit),
  };
}
