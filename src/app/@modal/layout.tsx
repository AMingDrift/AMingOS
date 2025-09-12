import type { FC, ReactNode } from 'react';

import React from 'react';

import ModalWrapper from './components/modal-wrapper';
import UrlListener from './components/url-listener';

const Page: FC = ({
    doc,
    blog,
    about,
}: {
    doc?: ReactNode;
    blog?: ReactNode;
    about?: ReactNode;
}) => {
    return (
        <>
            <ModalWrapper routerName="about">{about}</ModalWrapper>
            <ModalWrapper routerName="blog">{blog}</ModalWrapper>
            <ModalWrapper routerName="doc">{doc}</ModalWrapper>
            <UrlListener />
        </>
    );
};

export default Page;
