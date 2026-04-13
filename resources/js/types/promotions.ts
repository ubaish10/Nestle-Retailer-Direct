export type Promotion = {
    id: number;
    title: string;
    description: string | null;
    promo_code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    minimum_order_amount: number | null;
    maximum_discount_amount: number | null;
    start_date: string;
    expiry_date: string;
    is_active: boolean;
    usage_limit: number | null;
    usage_count: number;
    products_count: number;
    status: 'active' | 'inactive' | 'expired' | 'scheduled';
    days_remaining: number | null;
    created_at: string;
    selected_product_ids?: number[];
};

export type ActivePromotion = {
    id: number;
    title: string;
    description: string | null;
    promo_code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    minimum_order_amount: number | null;
    start_date: string;
    expiry_date: string;
    products: Array<{ id: number; name: string }>;
    days_remaining: number;
};

export type ValidatedPromotion = {
    id: number;
    title: string;
    promo_code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    discount_amount: number;
};
