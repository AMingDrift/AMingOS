import type { FC, ReactNode } from 'react';

import React from 'react';

import ModalWrapper from './components/modal-wrapper';

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
            <ModalWrapper routerName="doc">{doc}</ModalWrapper>
            <ModalWrapper routerName="blog">{blog}</ModalWrapper>
            <ModalWrapper routerName="about">{about}</ModalWrapper>
        </>
    );
};

export default Page;
