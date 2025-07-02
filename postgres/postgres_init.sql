CREATE TABLE public.user
(
    id SERIAL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    is_email_verified BOOLEAN NOT NULL DEFAULT false,
    email_verifycode TEXT NOT NULL DEFAULT '',
    CONSTRAINT user_pkey PRIMARY KEY (id)
);

INSERT INTO public.user (username,email,password,role,is_email_verified) VALUES ('admin', '', '123456', 'admin',true); 