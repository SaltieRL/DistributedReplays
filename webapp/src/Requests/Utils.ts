import _ from "lodash"
import qs from "qs"

export interface QueryParamMetadata {
    name: string
    isDate?: boolean
    optional?: boolean
}

export const stringifyQueryParams = (queryParams: any, queryParamMetadatas: QueryParamMetadata[]): string => {
    const parsedQueryParams: object = _.fromPairs(
        queryParamMetadatas
            .filter((queryParamMetadata) =>
                !queryParamMetadata.optional || queryParams[queryParamMetadata.name] !== undefined)
            .map((queryParamMetadata) => {
                    let queryParamValue = queryParams[queryParamMetadata.name]
                    if (queryParamMetadata.isDate) {
                        queryParamValue = queryParamValue.unix()
                    }
                    return [_.snakeCase(queryParamMetadata.name), queryParamValue]
                }
            )
    )

    return qs.stringify(
        parsedQueryParams,
        {arrayFormat: "repeat", addQueryPrefix: true}
    )
}
