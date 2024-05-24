/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ClerkUser {
    backup_code_enabled?: boolean;
    banned?: boolean;
    create_organization_enabled?: boolean;
    created_at?: number;
    delete_self_enabled?: boolean;
    email_addresses?: {
        created_at?: number;
        email_address?: string;
        id?: string;
        linked_to?: {
            id?: string;
            type?: string;
        }[];
        object?: string;
        reserved?: boolean;
        updated_at?: number;
        verification?: {
            attempts?: number | null;
            expire_at?: number | null;
            status?: string;
            strategy?: string;
        };
    }[];
    external_accounts?: {
        approved_scopes?: string;
        avatar_url?: string;
        created_at?: number;
        email_address?: string;
        first_name?: string;
        id?: string;
        identification_id?: string;
        image_url?: string;
        label?: string | null;
        last_name?: string;
        object?: string;
        provider?: string;
        provider_user_id?: string;
        public_metadata?: {};
        updated_at?: number;
        username?: string;
        verification?: {
            attempts?: number | null;
            expire_at?: number;
            status?: string;
            strategy?: string;
        };
    }[];
    external_id?: string | null;
    first_name?: string | null;
    has_image?: boolean;
    id?: string;
    image_url?: string;
    last_active_at?: number;
    last_name?: string | null;
    last_sign_in_at?: number | null;
    locked?: boolean;
    lockout_expires_in_seconds?: number | null;
    object?: string;
    passkeys?: any[];
    password_enabled?: boolean;
    phone_numbers?: any[];
    primary_email_address_id?: string;
    primary_phone_number_id?: string | null;
    primary_web3_wallet_id?: string | null;
    private_metadata?: {};
    profile_image_url?: string;
    public_metadata?: {};
    saml_accounts?: any[];
    totp_enabled?: boolean;
    two_factor_enabled?: boolean;
    unsafe_metadata?: {};
    updated_at?: number;
    username?: string;
    verification_attempts_remaining?: number;
    web3_wallets?: any[];
}
