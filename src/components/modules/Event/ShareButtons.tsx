'use client';

import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    XIcon,
    LinkedinIcon,
    WhatsappIcon,
    EmailIcon,
} from 'react-share';

interface ShareButtonsProps {
    url: string;
    title: string;
    description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
            <p>Share this event with friends</p>
            <div className="mt-3 flex justify-center gap-2">
                <FacebookShareButton url={url} title={title}>
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={url} title={title}>
                    <XIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton url={url} title={title} summary={description}>
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <WhatsappShareButton url={url} title={title}>
                    <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <EmailShareButton url={url} subject={title} body={description}>
                    <EmailIcon size={32} round />
                </EmailShareButton>
            </div>
        </div>
    );
}
