import { useQuery } from '@tanstack/react-query';
import AsideFilter from './AsideFilter';
import SortProductList from './SortProductList';
import productApi from 'src/apis/product.api';
import useQueryParams from 'src/hooks/useQueryParams';
import Product from './Product';
import Pagination from 'src/components/Pagination';
import { ProductListConfig } from 'src/types/product.type';
import { isUndefined, omitBy } from 'lodash';

export type QueryConfig = {
    [key in keyof ProductListConfig]: string;
};

function ProductList() {
    const queryParams: QueryConfig = useQueryParams();
    const queryConfig: QueryConfig = omitBy(
        {
            page: queryParams.page || '1',
            limit: queryParams.limit || 15,
            sort_by: queryParams.sort_by,
            exclude: queryParams.exclude,
            name: queryParams.name,
            order: queryParams.order,
            price_max: queryParams.price_max,
            price_min: queryParams.price_min,
            rating_filter: queryParams.rating_filter
        },
        isUndefined
    );
    const { data } = useQuery({
        queryKey: ['products', queryParams],
        queryFn: () => {
            return productApi.getProducts(queryConfig as ProductListConfig);
        },
        keepPreviousData: true
    });

    return (
        <div className='bg-gray-200 py-6'>
            <div className='container'>
                {data && (
                    <div className='grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <AsideFilter />
                        </div>
                        <div className='col-span-9'>
                            <SortProductList />
                            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                                {data.data.data.products.map((product) => (
                                    <div className='col-span-1' key={product._id}>
                                        <Product product={product} />
                                    </div>
                                ))}
                            </div>
                            <Pagination queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductList;
