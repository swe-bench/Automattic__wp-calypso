export const PRODUCT_AKISMET_FREE = 'ak_free_yearly';
export const PRODUCT_AKISMET_PERSONAL_MONTHLY = 'ak_personal_monthly';
export const PRODUCT_AKISMET_PERSONAL_YEARLY = 'ak_personal_yearly';
export const PRODUCT_AKISMET_PLUS_YEARLY = 'ak_plus_yearly_1';
export const PRODUCT_AKISMET_PLUS_MONTHLY = 'ak_plus_monthly_1';
export const PRODUCT_AKISMET_PLUS_20K_YEARLY = 'ak_plus_yearly_2';
export const PRODUCT_AKISMET_PLUS_20K_MONTHLY = 'ak_plus_monthly_2';
export const PRODUCT_AKISMET_PLUS_30K_YEARLY = 'ak_plus_yearly_3';
export const PRODUCT_AKISMET_PLUS_30K_MONTHLY = 'ak_plus_monthly_3';
export const PRODUCT_AKISMET_PLUS_40K_YEARLY = 'ak_plus_yearly_4';
export const PRODUCT_AKISMET_PLUS_40K_MONTHLY = 'ak_plus_monthly_4';
export const PRODUCT_AKISMET_ENTERPRISE_YEARLY = 'ak_ent_yearly_1';
export const PRODUCT_AKISMET_ENTERPRISE_MONTHLY = 'ak_ent_monthly_1';
export const PRODUCT_AKISMET_ENTERPRISE_350K_YEARLY = 'ak_ep350k_yearly_1';
export const PRODUCT_AKISMET_ENTERPRISE_350K_MONTHLY = 'ak_ep350k_monthly_1';
export const PRODUCT_AKISMET_ENTERPRISE_2M_YEARLY = 'ak_ep2m_yearly_1';
export const PRODUCT_AKISMET_ENTERPRISE_2M_MONTHLY = 'ak_ep2m_monthly_1';
export const PRODUCT_AKISMET_ENTERPRISE_GT2M_YEARLY = 'ak_epgt2m_yearly_1';
export const PRODUCT_AKISMET_ENTERPRISE_GT2M_MONTHLY = 'ak_epgt2m_monthly_1';

export const AKISTMET_PLUS_MONTHLY_PRODUCTS = <const>[
	PRODUCT_AKISMET_PLUS_MONTHLY,
	PRODUCT_AKISMET_PLUS_20K_MONTHLY,
	PRODUCT_AKISMET_PLUS_30K_MONTHLY,
	PRODUCT_AKISMET_PLUS_40K_MONTHLY,
];

export const AKISMET_ENTERPRISE_MONTHLY_PRODUCTS = <const>[
	PRODUCT_AKISMET_ENTERPRISE_2M_YEARLY,
	PRODUCT_AKISMET_ENTERPRISE_2M_MONTHLY,
	PRODUCT_AKISMET_ENTERPRISE_GT2M_YEARLY,
	PRODUCT_AKISMET_ENTERPRISE_GT2M_MONTHLY,
];

export const AKISMET_PLUS_YEARLY_PRODUCTS = <const>[
	PRODUCT_AKISMET_PLUS_YEARLY,
	PRODUCT_AKISMET_PLUS_20K_YEARLY,
	PRODUCT_AKISMET_PLUS_30K_YEARLY,
	PRODUCT_AKISMET_PLUS_40K_YEARLY,
];

export const AKISMET_ENTERPRISE_YEARLY_PRODUCTS = <const>[
	PRODUCT_AKISMET_ENTERPRISE_YEARLY,
	PRODUCT_AKISMET_ENTERPRISE_350K_YEARLY,
	PRODUCT_AKISMET_ENTERPRISE_2M_YEARLY,
	PRODUCT_AKISMET_ENTERPRISE_GT2M_YEARLY,
];

export const AKISMET_PERSONAL_PRODUCTS = <const>[
	PRODUCT_AKISMET_PERSONAL_MONTHLY,
	PRODUCT_AKISMET_PERSONAL_YEARLY,
];

export const AKISMET_PLUS_PRODUCTS = <const>[
	...AKISTMET_PLUS_MONTHLY_PRODUCTS,
	...AKISMET_PLUS_YEARLY_PRODUCTS,
];

export const AKISMET_ENTERPRISE_PRODUCTS = <const>[
	...AKISMET_ENTERPRISE_MONTHLY_PRODUCTS,
	...AKISMET_ENTERPRISE_YEARLY_PRODUCTS,
];

export const AKISMET_MONTHLY_PRODUCTS = <const>[
	PRODUCT_AKISMET_PERSONAL_MONTHLY,
	...AKISTMET_PLUS_MONTHLY_PRODUCTS,
	...AKISMET_ENTERPRISE_MONTHLY_PRODUCTS,
];

export const AKISMET_YEARLY_PRODUCTS = <const>[
	PRODUCT_AKISMET_FREE,
	PRODUCT_AKISMET_PERSONAL_YEARLY,
	...AKISMET_PLUS_YEARLY_PRODUCTS,
	...AKISMET_ENTERPRISE_YEARLY_PRODUCTS,
];

export const AKISMET_PRODUCTS_LIST = <const>[
	PRODUCT_AKISMET_FREE,
	...AKISMET_PERSONAL_PRODUCTS,
	...AKISMET_PLUS_PRODUCTS,
	...AKISMET_ENTERPRISE_PRODUCTS,
];

export const AKISMET_UPGADES_PRODUCTS_MAP = {
	[ PRODUCT_AKISMET_FREE ]: `/checkout/akismet/${ PRODUCT_AKISMET_PERSONAL_YEARLY }`,
	[ PRODUCT_AKISMET_PERSONAL_MONTHLY ]: `/checkout/akismet/${ PRODUCT_AKISMET_PLUS_MONTHLY }`,
	[ PRODUCT_AKISMET_PERSONAL_YEARLY ]: `/checkout/akismet/${ PRODUCT_AKISMET_PLUS_YEARLY }`,
	[ PRODUCT_AKISMET_PLUS_MONTHLY ]: `/checkout/akismet/${ PRODUCT_AKISMET_PLUS_20K_MONTHLY }`,
	[ PRODUCT_AKISMET_PLUS_YEARLY ]: `/checkout/akismet/${ PRODUCT_AKISMET_PLUS_20K_YEARLY }`,
	[ PRODUCT_AKISMET_PLUS_20K_MONTHLY ]: `/checkout/akismet/${ PRODUCT_AKISMET_PLUS_30K_MONTHLY }`,
	[ PRODUCT_AKISMET_PLUS_20K_YEARLY ]: `/checkout/akismet/${ PRODUCT_AKISMET_PLUS_30K_YEARLY }`,
	[ PRODUCT_AKISMET_PLUS_30K_MONTHLY ]: `/checkout/akismet/${ PRODUCT_AKISMET_PLUS_40K_MONTHLY }`,
	[ PRODUCT_AKISMET_PLUS_30K_YEARLY ]: `/checkout/akismet/${ PRODUCT_AKISMET_PLUS_40K_YEARLY }`,
	[ PRODUCT_AKISMET_PLUS_40K_MONTHLY ]: 'https://akismet.com/enterprise',
	[ PRODUCT_AKISMET_PLUS_40K_YEARLY ]: 'https://akismet.com/enterprise',
};
