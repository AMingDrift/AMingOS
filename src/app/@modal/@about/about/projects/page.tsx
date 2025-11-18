import React from 'react';
import Image from 'next/image';
import { BlurFade } from '@/_components/magicui/blur-fade';
import { projects } from './constants';
import Link from 'next/link';
import { Badge } from '@/_components/shadcn/ui/badge';
import { Button } from '@/_components/shadcn/ui/button';
const ProjectPage = () => {
    const projectsListByType = [
        { title: '🖥️ 网站', projects: projects.web },
        { title: '🛠 工具', projects: projects.tool },
    ];
    return (
        <>
            {projectsListByType.map((projectsList) => (
                <div className="mb-10" key={projectsList.title}>
                    <div className="pl-10 text-xl">{projectsList.title}</div>

                    <div className="mx-10 mt-5 columns-1 gap-5 md:columns-2 2xl:columns-3">
                        {projectsList.projects.map((project, idx) => (
                            <BlurFade
                                key={project.website}
                                delay={0.25 + idx * 0.05}
                                inView
                                className="mb-10 flex break-inside-avoid flex-col"
                            >
                                <div className="group relative flex transform flex-col overflow-hidden rounded-xl transition-all duration-300 ease-out select-none hover:scale-105 hover:shadow-(--card-shadow) hover:backdrop-blur-md">
                                    <Image
                                        key={project.preview}
                                        alt={project.preview}
                                        src={project.preview}
                                        width={800}
                                        height={400}
                                        className="aspect-[2/1] w-full rounded-t-lg object-cover"
                                        style={{ width: '100%', height: 'auto' }}
                                    />

                                    <div className="min-h-[125px] bg-white p-3 dark:bg-neutral-950">
                                        <div className="flex items-center justify-between">
                                            <Link
                                                className="animate-decoration text-sm"
                                                href={project.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {project.title}
                                            </Link>
                                            <Button
                                                variant="outline"
                                                asChild
                                                size="sm"
                                                className="h-[25px] rounded-xl"
                                            >
                                                <Link
                                                    href={project.source}
                                                    target="_blank"
                                                    className="text-[10px]"
                                                    rel="noopener noreferrer"
                                                >
                                                    源码
                                                </Link>
                                            </Button>
                                        </div>

                                        <p className="my-2 text-[11px] text-gray-500">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className="text-[11px]"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
};

export default ProjectPage;
