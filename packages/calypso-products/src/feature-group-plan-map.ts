import i18n from 'i18n-calypso';
import {
	EXPERT_SUPPORT_ALL_DAYS,
	FEATURE_1_WEBSITE,
	FEATURE_20_PREMIUM_THEMES,
	FEATURE_48_PREMIUM_THEMES,
	FEATURE_ABANDONED_CART_RECOVERY,
	FEATURE_ACCEPT_LOCAL_PAYMENTS,
	FEATURE_ADVANCED_SEO_TOOLS,
	FEATURE_ADVERTISE_ON_GOOGLE,
	FEATURE_AD_FREE_EXPERIENCE,
	FEATURE_AD_SUPPORTED_EXPERIENCE,
	FEATURE_AI_ASSISTED_PRODUCT_DESCRIPTION,
	FEATURE_ALWAYS_ONLINE,
	FEATURE_ASSEMBLED_KITS,
	FEATURE_AUTOMATED_BACKUPS_SECURITY_SCAN,
	FEATURE_AUTOMATED_BURST_SCALING,
	FEATURE_AUTOMATED_SALES_TAXES,
	FEATURE_BACK_IN_STOCK_NOTIFICATIONS,
	FEATURE_BANDWIDTH,
	FEATURE_BEAUTIFUL_THEMES,
	FEATURE_BULK_DISCOUNTS,
	FEATURE_BURST,
	FEATURE_CDN,
	FEATURE_COMMISSION_FEE_STANDARD_FEATURES,
	FEATURE_COMMISSION_FEE_WOO_FEATURES,
	FEATURE_CONNECT_WITH_FACEBOOK,
	FEATURE_CONTACT_FORM_JP,
	FEATURE_CPUS,
	FEATURE_CUSTOMER_BIRTHDAY_EMAILS,
	FEATURE_CUSTOM_DOMAIN,
	FEATURE_CUSTOM_MARKETING_AUTOMATION,
	FEATURE_CUSTOM_ORDER_EMAILS,
	FEATURE_CUSTOM_PRODUCT_KITS,
	FEATURE_DATABASE_ACCESS,
	FEATURE_DATACENTRE_FAILOVER,
	FEATURE_DEV_TOOLS,
	FEATURE_DISCOUNTED_SHIPPING,
	FEATURE_DISPLAY_PRODUCTS_BRAND,
	FEATURE_DONATIONS_AND_TIPS_JP,
	FEATURE_DYNAMIC_UPSELLS,
	FEATURE_ES_SEARCH_JP,
	FEATURE_FAST_DNS,
	FEATURE_FREE_DOMAIN,
	FEATURE_FREE_MIGRATIONS,
	FEATURE_FREE_SSL_CERTIFICATE,
	FEATURE_FREE_WORDPRESS_THEMES,
	FEATURE_FULL_DATA_CENTER_REDUNDANCIES,
	FEATURE_GIFT_CARDS,
	FEATURE_GITHUB_DEPLOYMENTS,
	FEATURE_GLOBAL_EDGE_CACHING,
	FEATURE_GOOGLE_ANALYTICS_V3,
	FEATURE_GROUP_ALL_FEATURES,
	FEATURE_GROUP_DEVELOPER_TOOLS,
	FEATURE_GROUP_ECOMMERCE,
	FEATURE_GROUP_ESSENTIAL_FEATURES,
	FEATURE_GROUP_HIGH_AVAILABILITY,
	FEATURE_GROUP_MANAGED_WP_HOSTING,
	FEATURE_GROUP_MARKETING_EMAIL,
	FEATURE_GROUP_MARKETING_GROWTH_AND_MONETIZATION_TOOLS,
	FEATURE_GROUP_PAYMENTS,
	FEATURE_GROUP_PERFORMANCE_BOOSTERS,
	FEATURE_GROUP_PRODUCTS,
	FEATURE_GROUP_SECURITY_AND_SAFETY,
	FEATURE_GROUP_SHIPPING,
	FEATURE_GROUP_STORAGE,
	FEATURE_GROUP_SUPERIOR_COMMERCE_SOLUTIONS,
	FEATURE_GROUP_SUPPORT,
	FEATURE_GROUP_THEMES_AND_CUSTOMIZATION,
	FEATURE_GROUP_WEBSITE_BUILDING,
	FEATURE_GROUP_YOUR_STORE,
	FEATURE_HELP_CENTER_SUPPORT,
	FEATURE_INSTALL_PLUGINS,
	FEATURE_INTEGRATED_PAYMENTS,
	FEATURE_INTEGRATED_SHIPMENT_TRACKING,
	FEATURE_INTERNATIONAL_PAYMENTS,
	FEATURE_INVENTORY,
	FEATURE_INVENTORY_MGMT,
	FEATURE_ISOLATED_INFRA,
	FEATURE_LIMITED_STATS,
	FEATURE_LIST_PRODUCTS_BY_BRAND,
	FEATURE_LIST_UNLIMITED_PRODUCTS,
	FEATURE_LIVE_CHAT_SUPPORT,
	FEATURE_LIVE_SHIPPING_RATES,
	FEATURE_LOCAL_DEVELOPMENT_ENVIRONMENT,
	FEATURE_LOYALTY_POINTS_PROGRAMS,
	FEATURE_LOYALTY_PROG,
	FEATURE_MARKETING_AUTOMATION,
	FEATURE_MIN_MAX_ORDER_QUANTITY,
	FEATURE_MULTI_SITE,
	FEATURE_NEWSLETTERS_RSS,
	FEATURE_ONE_CLICK_RESTORE_V2,
	FEATURE_PAGES,
	FEATURE_PAID_SUBSCRIBERS_JP,
	FEATURE_PAYMENT_BUTTONS_JP,
	FEATURE_PAYMENT_TRANSACTION_FEES_0,
	FEATURE_PAYMENT_TRANSACTION_FEES_0_ALL,
	FEATURE_PAYMENT_TRANSACTION_FEES_0_WOO,
	FEATURE_PAYMENT_TRANSACTION_FEES_10,
	FEATURE_PAYMENT_TRANSACTION_FEES_2,
	FEATURE_PAYMENT_TRANSACTION_FEES_2_REGULAR,
	FEATURE_PAYMENT_TRANSACTION_FEES_4,
	FEATURE_PAYMENT_TRANSACTION_FEES_8,
	FEATURE_PAYPAL_JP,
	FEATURE_PLUGINS_THEMES,
	FEATURE_PLUGIN_AUTOUPDATE_JP,
	FEATURE_POST_EDITS_HISTORY,
	FEATURE_PREMIUM_CONTENT_JP,
	FEATURE_PREMIUM_STORE_THEMES,
	FEATURE_PREMIUM_THEMES,
	FEATURE_PRE_INSTALLED_ECOMMERCE_PLUGINS,
	FEATURE_PRE_INSTALLED_SECURITY_PERF_PLUGINS,
	FEATURE_PRINT_SHIPPING_LABELS,
	FEATURE_PRODUCT_ADD_ONS,
	FEATURE_PRODUCT_BUNDLES,
	FEATURE_PRODUCT_RECOMMENDATIONS,
	FEATURE_PROMOTE_ON_TIKTOK,
	FEATURE_REALTIME_BACKUPS_JP,
	FEATURE_REAL_TIME_SECURITY_SCANS,
	FEATURE_REAL_TIME_STATS,
	FEATURE_RECURRING_PAYMENTS,
	FEATURE_REFERRAL_PROGRAMS,
	FEATURE_SALES_REPORTS,
	FEATURE_SEAMLESS_STAGING_PRODUCTION_SYNCING,
	FEATURE_SECURITY_BRUTE_FORCE,
	FEATURE_SECURITY_DDOS,
	FEATURE_SECURITY_MALWARE,
	FEATURE_SECURITY_VULNERABILITY_NOTIFICATIONS,
	FEATURE_SELL_60_COUNTRIES,
	FEATURE_SEO_JP,
	FEATURE_SHARES_SOCIAL_MEDIA_JP,
	FEATURE_SHIPPING_INTEGRATIONS,
	FEATURE_SITE_ACTIVITY_LOG_JP,
	FEATURE_SITE_BACKUPS_AND_RESTORE,
	FEATURE_SITE_STAGING_SITES,
	FEATURE_SMART_REDIRECTS,
	FEATURE_SPAM_JP,
	FEATURE_STATS_JP,
	FEATURE_STATS_PAID,
	FEATURE_STOCK_NOTIFS,
	FEATURE_STORE_DESIGN,
	FEATURE_STREAMLINED_CHECKOUT,
	FEATURE_STYLE_CUSTOMIZATION,
	FEATURE_SUPPORT_EMAIL,
	FEATURE_SYNC_WITH_PINTEREST,
	FEATURE_TIERED_STORAGE_PLANS_AVAILABLE,
	FEATURE_UNLIMITED_ADMINS,
	FEATURE_UNLIMITED_PRODUCTS,
	FEATURE_UNLIMITED_TRAFFIC,
	FEATURE_UPTIME_MONITOR_JP,
	FEATURE_USERS,
	FEATURE_VIDEOPRESS_JP,
	FEATURE_WAF_V2,
	FEATURE_WEB_SERVER_SETTINGS,
	FEATURE_WOOCOMMERCE_MOBILE_APP,
	FEATURE_WOOCOMMERCE_STORE,
	FEATURE_WOOCOMMERCE_HOSTING,
	FEATURE_WORDADS,
	FEATURE_WORDPRESS_CMS,
	FEATURE_WORDPRESS_MOBILE_APP,
	FEATURE_WP_SUBDOMAIN_SIGNUP,
	FEATURE_WP_UPDATES,
	WPCOM_FEATURES_PREMIUM_THEMES_LIMITED,
	WPCOM_FEATURES_PREMIUM_THEMES_UNLIMITED,
	FEATURE_PRIORITY_24_7_SUPPORT,
	FEATURE_FAST_SUPPORT_FROM_EXPERTS,
} from './constants';
import {
	isTrailMapCopyVariant,
	isTrailMapStructureVariant,
	isTrailMapAnyVariant,
	getTrailMapExperiment,
} from './experiments';
import { FeatureGroupMap } from './types';

export const featureGroups: Partial< FeatureGroupMap > = {
	[ FEATURE_GROUP_ALL_FEATURES ]: {
		slug: FEATURE_GROUP_ALL_FEATURES,
		getTitle: () => null, // Intentionally null, as this is a placeholder for all features.
		getFeatures: () => [], // This is a placeholder for now. It will not be processed, but theoretically a reference to all the features.
	},
	[ FEATURE_GROUP_STORAGE ]: {
		slug: FEATURE_GROUP_STORAGE,
		getTitle: () => i18n.translate( 'Storage' ),
		getFeatures: () => [], // Intentionally empty for now. We will include a fixed list of feature slugs in a follow-up.
	},
	/* START: Plans 2023 Feature Group (To be deleted after pau2Xa-5Ol-P2 if trail map wins) */
	[ FEATURE_GROUP_ESSENTIAL_FEATURES ]: {
		slug: FEATURE_GROUP_ESSENTIAL_FEATURES,
		getTitle: () => i18n.translate( 'Essential features' ),
		getFeatures: () => [
			FEATURE_PAGES,
			FEATURE_USERS,
			FEATURE_POST_EDITS_HISTORY,
			FEATURE_ALWAYS_ONLINE,
			FEATURE_CUSTOM_DOMAIN,
			FEATURE_BANDWIDTH,
			FEATURE_STATS_JP,
			FEATURE_SUPPORT_EMAIL,
			FEATURE_LIVE_CHAT_SUPPORT,
			FEATURE_FAST_SUPPORT_FROM_EXPERTS,
			FEATURE_PRIORITY_24_7_SUPPORT,
			FEATURE_PLUGINS_THEMES,
			FEATURE_PLUGIN_AUTOUPDATE_JP,
			FEATURE_CONTACT_FORM_JP,
			FEATURE_ES_SEARCH_JP,
			FEATURE_SMART_REDIRECTS,
		],
	},
	[ FEATURE_GROUP_PERFORMANCE_BOOSTERS ]: {
		slug: FEATURE_GROUP_PERFORMANCE_BOOSTERS,
		getTitle: () => i18n.translate( 'Performance boosters' ),
		getFeatures: () => [
			FEATURE_FAST_DNS,
			FEATURE_BURST,
			FEATURE_CPUS,
			FEATURE_GLOBAL_EDGE_CACHING,
			FEATURE_CDN,
		],
	},
	[ FEATURE_GROUP_HIGH_AVAILABILITY ]: {
		slug: FEATURE_GROUP_HIGH_AVAILABILITY,
		getTitle: () => i18n.translate( 'High Availability' ),
		getFeatures: () => [
			FEATURE_DATACENTRE_FAILOVER,
			FEATURE_ONE_CLICK_RESTORE_V2,
			FEATURE_REALTIME_BACKUPS_JP,
			FEATURE_UPTIME_MONITOR_JP,
		],
	},
	[ FEATURE_GROUP_DEVELOPER_TOOLS ]: {
		slug: FEATURE_GROUP_DEVELOPER_TOOLS,
		getTitle: () => i18n.translate( 'Developer tools' ),
		getFeatures: () => {
			if ( isTrailMapCopyVariant() ) {
				return [
					FEATURE_DEV_TOOLS,
					FEATURE_SITE_STAGING_SITES,
					FEATURE_MULTI_SITE,
					FEATURE_WP_UPDATES,
					FEATURE_LOCAL_DEVELOPMENT_ENVIRONMENT,
					FEATURE_GITHUB_DEPLOYMENTS,
					FEATURE_DATABASE_ACCESS,
					FEATURE_WEB_SERVER_SETTINGS,
				];
			}

			if ( getTrailMapExperiment() === 'treatment_structure' ) {
				return [
					FEATURE_DEV_TOOLS,
					FEATURE_SITE_STAGING_SITES,
					FEATURE_SEAMLESS_STAGING_PRODUCTION_SYNCING,
					FEATURE_WP_UPDATES,
					FEATURE_MULTI_SITE,
					FEATURE_SECURITY_VULNERABILITY_NOTIFICATIONS,
				];
			}

			return [
				FEATURE_DEV_TOOLS,
				FEATURE_SITE_STAGING_SITES,
				FEATURE_MULTI_SITE,
				FEATURE_WP_UPDATES,
			];
		},
	},
	[ FEATURE_GROUP_SECURITY_AND_SAFETY ]: {
		slug: FEATURE_GROUP_SECURITY_AND_SAFETY,
		getTitle: () => i18n.translate( 'Security and safety' ),
		getFeatures: () => [
			FEATURE_SECURITY_BRUTE_FORCE,
			FEATURE_ISOLATED_INFRA,
			FEATURE_SPAM_JP,
			FEATURE_SECURITY_DDOS,
			FEATURE_SECURITY_MALWARE,
			FEATURE_WAF_V2,
			FEATURE_SITE_ACTIVITY_LOG_JP,
		],
	},
	[ FEATURE_GROUP_THEMES_AND_CUSTOMIZATION ]: {
		slug: FEATURE_GROUP_THEMES_AND_CUSTOMIZATION,
		getTitle: () => i18n.translate( 'Design customization' ),
		getFeatures: () => [
			FEATURE_BEAUTIFUL_THEMES,
			FEATURE_STYLE_CUSTOMIZATION,
			FEATURE_PREMIUM_THEMES,
		],
	},

	[ FEATURE_GROUP_SUPERIOR_COMMERCE_SOLUTIONS ]: {
		slug: FEATURE_GROUP_SUPERIOR_COMMERCE_SOLUTIONS,
		getTitle: () => i18n.translate( 'Commerce solutions' ),
		getFeatures: () => [
			FEATURE_PREMIUM_STORE_THEMES,
			FEATURE_STORE_DESIGN,
			FEATURE_UNLIMITED_PRODUCTS,
			FEATURE_DISPLAY_PRODUCTS_BRAND,
			FEATURE_PRODUCT_ADD_ONS,
			FEATURE_ASSEMBLED_KITS,
			FEATURE_MIN_MAX_ORDER_QUANTITY,
			FEATURE_STOCK_NOTIFS,
			FEATURE_DYNAMIC_UPSELLS,
			FEATURE_LOYALTY_PROG,
			FEATURE_CUSTOM_MARKETING_AUTOMATION,
			FEATURE_BULK_DISCOUNTS,
			FEATURE_INVENTORY_MGMT,
			FEATURE_STREAMLINED_CHECKOUT,
			FEATURE_SELL_60_COUNTRIES,
			FEATURE_SHIPPING_INTEGRATIONS,
		],
	},
	[ FEATURE_GROUP_MARKETING_GROWTH_AND_MONETIZATION_TOOLS ]: {
		slug: FEATURE_GROUP_MARKETING_GROWTH_AND_MONETIZATION_TOOLS,
		getTitle: () => i18n.translate( 'Growth and monetization tools' ),
		getFeatures: () =>
			isTrailMapStructureVariant()
				? [
						FEATURE_NEWSLETTERS_RSS,
						FEATURE_AD_FREE_EXPERIENCE,
						FEATURE_WORDADS,
						FEATURE_STATS_PAID,
						FEATURE_SHARES_SOCIAL_MEDIA_JP,
						FEATURE_SEO_JP,
						FEATURE_VIDEOPRESS_JP,
						FEATURE_PREMIUM_CONTENT_JP,
						FEATURE_PAID_SUBSCRIBERS_JP,
						FEATURE_COMMISSION_FEE_STANDARD_FEATURES,
						FEATURE_COMMISSION_FEE_WOO_FEATURES,
						FEATURE_DONATIONS_AND_TIPS_JP,
						FEATURE_PAYMENT_BUTTONS_JP,
						FEATURE_PAYPAL_JP,
						FEATURE_PAYMENT_TRANSACTION_FEES_10,
						FEATURE_PAYMENT_TRANSACTION_FEES_8,
						FEATURE_PAYMENT_TRANSACTION_FEES_4,
						FEATURE_PAYMENT_TRANSACTION_FEES_2,
						FEATURE_PAYMENT_TRANSACTION_FEES_0_WOO,
						FEATURE_PAYMENT_TRANSACTION_FEES_2_REGULAR,
						FEATURE_PAYMENT_TRANSACTION_FEES_0_ALL,
				  ]
				: [
						FEATURE_NEWSLETTERS_RSS,
						FEATURE_AD_FREE_EXPERIENCE,
						FEATURE_WORDADS,
						FEATURE_STATS_PAID,
						FEATURE_SHARES_SOCIAL_MEDIA_JP,
						FEATURE_SEO_JP,
						FEATURE_VIDEOPRESS_JP,
						FEATURE_PREMIUM_CONTENT_JP,
						FEATURE_PAID_SUBSCRIBERS_JP,
						FEATURE_COMMISSION_FEE_STANDARD_FEATURES,
						FEATURE_COMMISSION_FEE_WOO_FEATURES,
						FEATURE_DONATIONS_AND_TIPS_JP,
						FEATURE_PAYMENT_BUTTONS_JP,
						FEATURE_PAYPAL_JP,
				  ],
	},
	[ FEATURE_GROUP_YOUR_STORE ]: {
		slug: FEATURE_GROUP_YOUR_STORE,
		getTitle: () => i18n.translate( 'Your store' ),
		getFeatures: () => [
			FEATURE_WOOCOMMERCE_STORE,
			FEATURE_WOOCOMMERCE_MOBILE_APP,
			FEATURE_WORDPRESS_CMS,
			FEATURE_WORDPRESS_MOBILE_APP,
			FEATURE_CUSTOM_DOMAIN,
			FEATURE_FREE_SSL_CERTIFICATE,
			FEATURE_AUTOMATED_BACKUPS_SECURITY_SCAN,
			FEATURE_AD_FREE_EXPERIENCE,
			FEATURE_UNLIMITED_ADMINS,
			FEATURE_LIVE_CHAT_SUPPORT,
			FEATURE_FAST_SUPPORT_FROM_EXPERTS,
			WPCOM_FEATURES_PREMIUM_THEMES_UNLIMITED,
			FEATURE_SALES_REPORTS,
			FEATURE_GOOGLE_ANALYTICS_V3,
		],
	},
	/* END: Plans 2023 Feature Group (To be deleted after pau2Xa-5Ol-P2 if trail map wins) */

	/* START: Trail Map Feature Groups (To be deleted after pau2Xa-5Ol-P2 if trail map looses) */
	[ FEATURE_GROUP_WEBSITE_BUILDING ]: {
		slug: FEATURE_GROUP_WEBSITE_BUILDING,
		getTitle: () => i18n.translate( 'Website building' ),
		getFeatures: () =>
			getTrailMapExperiment() === 'treatment_structure'
				? [
						FEATURE_WP_SUBDOMAIN_SIGNUP,
						FEATURE_CUSTOM_DOMAIN,
						FEATURE_BEAUTIFUL_THEMES,
						WPCOM_FEATURES_PREMIUM_THEMES_LIMITED,
						WPCOM_FEATURES_PREMIUM_THEMES_UNLIMITED,
						FEATURE_PLUGINS_THEMES,
						FEATURE_USERS,
						FEATURE_PAGES,
						FEATURE_POST_EDITS_HISTORY,
						FEATURE_NEWSLETTERS_RSS,
						FEATURE_AD_FREE_EXPERIENCE,
						FEATURE_STYLE_CUSTOMIZATION,
						FEATURE_WORDADS,
						FEATURE_UNLIMITED_TRAFFIC,
						FEATURE_PREMIUM_STORE_THEMES,
						FEATURE_STORE_DESIGN,
				  ]
				: [
						FEATURE_WP_SUBDOMAIN_SIGNUP,
						FEATURE_CUSTOM_DOMAIN,
						FEATURE_USERS,
						FEATURE_FREE_WORDPRESS_THEMES,
						FEATURE_LIMITED_STATS,
						FEATURE_AD_FREE_EXPERIENCE,
						FEATURE_AD_SUPPORTED_EXPERIENCE,
						FEATURE_FREE_DOMAIN,
						FEATURE_20_PREMIUM_THEMES,
						FEATURE_48_PREMIUM_THEMES,
						FEATURE_PREMIUM_THEMES,
						FEATURE_REAL_TIME_STATS,
						FEATURE_STYLE_CUSTOMIZATION,
						FEATURE_VIDEOPRESS_JP,
						FEATURE_INSTALL_PLUGINS,
						FEATURE_PRE_INSTALLED_SECURITY_PERF_PLUGINS,
				  ],
	},
	[ FEATURE_GROUP_MANAGED_WP_HOSTING ]: {
		slug: FEATURE_GROUP_MANAGED_WP_HOSTING,
		getTitle: () => i18n.translate( 'Managed WordPress Hosting' ),
		getFeatures: () =>
			getTrailMapExperiment() === 'treatment_structure'
				? [
						FEATURE_SECURITY_BRUTE_FORCE,
						FEATURE_SMART_REDIRECTS,
						FEATURE_ALWAYS_ONLINE,
						FEATURE_FAST_DNS,
						FEATURE_BANDWIDTH,
						FEATURE_GLOBAL_EDGE_CACHING,
						FEATURE_BURST,
						FEATURE_WAF_V2,
						FEATURE_CDN,
						FEATURE_CPUS,
						FEATURE_DATACENTRE_FAILOVER,
						FEATURE_ISOLATED_INFRA,
						FEATURE_SECURITY_MALWARE,
						FEATURE_TIERED_STORAGE_PLANS_AVAILABLE,
						FEATURE_REAL_TIME_SECURITY_SCANS,
						FEATURE_SPAM_JP,
						FEATURE_SECURITY_DDOS,
						FEATURE_WOOCOMMERCE_HOSTING,
				  ]
				: [
						FEATURE_1_WEBSITE,
						FEATURE_UNLIMITED_TRAFFIC,
						FEATURE_BANDWIDTH,
						FEATURE_FREE_SSL_CERTIFICATE,
						FEATURE_CDN,
						FEATURE_POST_EDITS_HISTORY,
						FEATURE_SITE_BACKUPS_AND_RESTORE,
						FEATURE_FREE_MIGRATIONS,
						FEATURE_AUTOMATED_BURST_SCALING,
						FEATURE_WAF_V2,
						FEATURE_SECURITY_DDOS,
						FEATURE_FULL_DATA_CENTER_REDUNDANCIES,
						FEATURE_REAL_TIME_SECURITY_SCANS,
				  ],
	},
	[ FEATURE_GROUP_ECOMMERCE ]: {
		slug: FEATURE_GROUP_ECOMMERCE,
		getTitle: () => i18n.translate( 'eCommerce' ),
		getFeatures: () =>
			getTrailMapExperiment() === 'treatment_structure'
				? [
						FEATURE_COMMISSION_FEE_STANDARD_FEATURES,
						FEATURE_COMMISSION_FEE_WOO_FEATURES,
						FEATURE_PAYMENT_TRANSACTION_FEES_10,
						FEATURE_PAYMENT_TRANSACTION_FEES_8,
						FEATURE_PAYMENT_TRANSACTION_FEES_4,
						FEATURE_PAYMENT_TRANSACTION_FEES_2,
						FEATURE_PAYMENT_TRANSACTION_FEES_2_REGULAR,
						FEATURE_PAYMENT_TRANSACTION_FEES_0,
						FEATURE_PAYMENT_TRANSACTION_FEES_0_WOO,
						FEATURE_PRE_INSTALLED_ECOMMERCE_PLUGINS,
						FEATURE_UNLIMITED_PRODUCTS,
						FEATURE_MIN_MAX_ORDER_QUANTITY,
						FEATURE_BULK_DISCOUNTS,
						FEATURE_INVENTORY,
						FEATURE_DYNAMIC_UPSELLS,
						FEATURE_STOCK_NOTIFS,
						FEATURE_DISPLAY_PRODUCTS_BRAND,
						FEATURE_PRODUCT_ADD_ONS,
						FEATURE_ASSEMBLED_KITS,
						FEATURE_BACK_IN_STOCK_NOTIFICATIONS,
						FEATURE_LOYALTY_PROG,
						FEATURE_CUSTOM_MARKETING_AUTOMATION,
						FEATURE_INVENTORY_MGMT,
						FEATURE_STREAMLINED_CHECKOUT,
						FEATURE_SELL_60_COUNTRIES,
						FEATURE_SHIPPING_INTEGRATIONS,
				  ]
				: [
						FEATURE_COMMISSION_FEE_STANDARD_FEATURES,
						FEATURE_COMMISSION_FEE_WOO_FEATURES,
						FEATURE_PAYMENT_TRANSACTION_FEES_10,
						FEATURE_PAYMENT_TRANSACTION_FEES_8,
						FEATURE_PAYMENT_TRANSACTION_FEES_4,
						FEATURE_PAYMENT_TRANSACTION_FEES_2,
						FEATURE_PAYMENT_TRANSACTION_FEES_2_REGULAR,
						FEATURE_PAYMENT_TRANSACTION_FEES_0,
						FEATURE_PAYMENT_TRANSACTION_FEES_0_WOO,
						FEATURE_STORE_DESIGN,
						FEATURE_PRE_INSTALLED_ECOMMERCE_PLUGINS,
						FEATURE_UNLIMITED_PRODUCTS,
						FEATURE_MIN_MAX_ORDER_QUANTITY,
						FEATURE_BULK_DISCOUNTS,
						FEATURE_INVENTORY,
						FEATURE_DYNAMIC_UPSELLS,
						FEATURE_STOCK_NOTIFS,
				  ],
	},

	[ FEATURE_GROUP_SUPPORT ]: {
		slug: FEATURE_GROUP_SUPPORT,
		getTitle: () => i18n.translate( 'Support' ),
		getFeatures: () => [
			FEATURE_HELP_CENTER_SUPPORT,
			FEATURE_FAST_SUPPORT_FROM_EXPERTS,
			FEATURE_SUPPORT_EMAIL,
			EXPERT_SUPPORT_ALL_DAYS,
			FEATURE_FAST_SUPPORT_FROM_EXPERTS,
			FEATURE_PRIORITY_24_7_SUPPORT,
			FEATURE_LIVE_CHAT_SUPPORT,
		],
	},
	/* END: Trail Map Feature Groups(To be deleted after pau2Xa-5Ol-P2 if trail map looses) */

	/* START: WooExpress Feature Groups */
	[ FEATURE_GROUP_PRODUCTS ]: {
		slug: FEATURE_GROUP_PRODUCTS,
		getTitle: () => i18n.translate( 'Products' ),
		getFeatures: () => [
			FEATURE_LIST_UNLIMITED_PRODUCTS,
			FEATURE_GIFT_CARDS,
			FEATURE_MIN_MAX_ORDER_QUANTITY,
			FEATURE_PRODUCT_BUNDLES,
			FEATURE_CUSTOM_PRODUCT_KITS,
			FEATURE_LIST_PRODUCTS_BY_BRAND,
			FEATURE_PRODUCT_RECOMMENDATIONS,
			FEATURE_AI_ASSISTED_PRODUCT_DESCRIPTION,
		],
	},
	[ FEATURE_GROUP_PAYMENTS ]: {
		slug: FEATURE_GROUP_PAYMENTS,
		getTitle: () => i18n.translate( 'Payments' ),
		getFeatures: () => [
			FEATURE_INTEGRATED_PAYMENTS,
			FEATURE_INTERNATIONAL_PAYMENTS,
			FEATURE_AUTOMATED_SALES_TAXES,
			FEATURE_ACCEPT_LOCAL_PAYMENTS,
			FEATURE_RECURRING_PAYMENTS,
		],
		getFootnotes: () => ( {
			[ i18n.translate(
				'Available as standard in WooCommerce Payments (restrictions apply). Additional extensions may be required for other payment providers.'
			) ]: [
				FEATURE_INTERNATIONAL_PAYMENTS,
				FEATURE_ACCEPT_LOCAL_PAYMENTS,
				FEATURE_RECURRING_PAYMENTS,
			],
		} ),
	},
	[ FEATURE_GROUP_MARKETING_EMAIL ]: {
		slug: FEATURE_GROUP_MARKETING_EMAIL,
		getTitle: () => i18n.translate( 'Marketing & Email' ),
		getFeatures: () => [
			FEATURE_PROMOTE_ON_TIKTOK,
			FEATURE_SYNC_WITH_PINTEREST,
			FEATURE_CONNECT_WITH_FACEBOOK,
			FEATURE_BACK_IN_STOCK_NOTIFICATIONS,
			FEATURE_MARKETING_AUTOMATION,
			FEATURE_ABANDONED_CART_RECOVERY,
			FEATURE_ADVANCED_SEO_TOOLS,
			FEATURE_ADVERTISE_ON_GOOGLE,
			FEATURE_REFERRAL_PROGRAMS,
			FEATURE_CUSTOMER_BIRTHDAY_EMAILS,
			FEATURE_CUSTOM_ORDER_EMAILS,
			FEATURE_LOYALTY_POINTS_PROGRAMS,
		],
	},
	[ FEATURE_GROUP_SHIPPING ]: {
		slug: FEATURE_GROUP_SHIPPING,
		getTitle: () => i18n.translate( 'Shipping' ),
		getFeatures: () => [
			FEATURE_INTEGRATED_SHIPMENT_TRACKING,
			FEATURE_LIVE_SHIPPING_RATES,
			FEATURE_DISCOUNTED_SHIPPING,
			FEATURE_PRINT_SHIPPING_LABELS,
		],
		getFootnotes: () => ( {
			[ i18n.translate(
				'Only available in the U.S. – an additional extension will be required for other countries.'
			) ]: [ FEATURE_DISCOUNTED_SHIPPING, FEATURE_PRINT_SHIPPING_LABELS ],
		} ),
	},
	/* START: WooExpress Feature Groups */
};

export function resolveFeatureGroupsForFeaturesGrid(): Partial< FeatureGroupMap > {
	if ( isTrailMapStructureVariant() ) {
		return {
			[ FEATURE_GROUP_STORAGE ]: featureGroups[ FEATURE_GROUP_STORAGE ],
			[ FEATURE_GROUP_WEBSITE_BUILDING ]: featureGroups[ FEATURE_GROUP_WEBSITE_BUILDING ],
			[ FEATURE_GROUP_MANAGED_WP_HOSTING ]: featureGroups[ FEATURE_GROUP_MANAGED_WP_HOSTING ],
			[ FEATURE_GROUP_DEVELOPER_TOOLS ]: featureGroups[ FEATURE_GROUP_DEVELOPER_TOOLS ],
			[ FEATURE_GROUP_ECOMMERCE ]: featureGroups[ FEATURE_GROUP_ECOMMERCE ],
			[ FEATURE_GROUP_SUPPORT ]: featureGroups[ FEATURE_GROUP_SUPPORT ],
		};
	}

	return {
		[ FEATURE_GROUP_ALL_FEATURES ]: featureGroups[ FEATURE_GROUP_ALL_FEATURES ],
		[ FEATURE_GROUP_STORAGE ]: featureGroups[ FEATURE_GROUP_STORAGE ],
	};
}

export function resolveFeatureGroupsForComparisonGrid(): Partial< FeatureGroupMap > {
	if ( isTrailMapAnyVariant() ) {
		return {
			[ FEATURE_GROUP_STORAGE ]: featureGroups[ FEATURE_GROUP_STORAGE ],
			[ FEATURE_GROUP_WEBSITE_BUILDING ]: featureGroups[ FEATURE_GROUP_WEBSITE_BUILDING ],
			[ FEATURE_GROUP_MANAGED_WP_HOSTING ]: featureGroups[ FEATURE_GROUP_MANAGED_WP_HOSTING ],
			[ FEATURE_GROUP_DEVELOPER_TOOLS ]: featureGroups[ FEATURE_GROUP_DEVELOPER_TOOLS ],
			[ FEATURE_GROUP_ECOMMERCE ]: featureGroups[ FEATURE_GROUP_ECOMMERCE ],
			[ FEATURE_GROUP_SUPPORT ]: featureGroups[ FEATURE_GROUP_SUPPORT ],
		};
	}

	return {
		[ FEATURE_GROUP_ESSENTIAL_FEATURES ]: featureGroups[ FEATURE_GROUP_ESSENTIAL_FEATURES ],
		[ FEATURE_GROUP_PERFORMANCE_BOOSTERS ]: featureGroups[ FEATURE_GROUP_PERFORMANCE_BOOSTERS ],
		[ FEATURE_GROUP_HIGH_AVAILABILITY ]: featureGroups[ FEATURE_GROUP_HIGH_AVAILABILITY ],
		[ FEATURE_GROUP_DEVELOPER_TOOLS ]: featureGroups[ FEATURE_GROUP_DEVELOPER_TOOLS ],
		[ FEATURE_GROUP_SECURITY_AND_SAFETY ]: featureGroups[ FEATURE_GROUP_SECURITY_AND_SAFETY ],
		[ FEATURE_GROUP_THEMES_AND_CUSTOMIZATION ]:
			featureGroups[ FEATURE_GROUP_THEMES_AND_CUSTOMIZATION ],
		[ FEATURE_GROUP_SUPERIOR_COMMERCE_SOLUTIONS ]:
			featureGroups[ FEATURE_GROUP_SUPERIOR_COMMERCE_SOLUTIONS ],
		[ FEATURE_GROUP_MARKETING_GROWTH_AND_MONETIZATION_TOOLS ]:
			featureGroups[ FEATURE_GROUP_MARKETING_GROWTH_AND_MONETIZATION_TOOLS ],
		[ FEATURE_GROUP_STORAGE ]: featureGroups[ FEATURE_GROUP_STORAGE ],
	};
}

export function resolveWooExpressFeatureGroupsForComparisonGrid(): Partial< FeatureGroupMap > {
	return {
		[ FEATURE_GROUP_YOUR_STORE ]: featureGroups[ FEATURE_GROUP_YOUR_STORE ],
		[ FEATURE_GROUP_PRODUCTS ]: featureGroups[ FEATURE_GROUP_PRODUCTS ],
		[ FEATURE_GROUP_PAYMENTS ]: featureGroups[ FEATURE_GROUP_PAYMENTS ],
		[ FEATURE_GROUP_MARKETING_EMAIL ]: featureGroups[ FEATURE_GROUP_MARKETING_EMAIL ],
		[ FEATURE_GROUP_SHIPPING ]: featureGroups[ FEATURE_GROUP_SHIPPING ],
	};
}
