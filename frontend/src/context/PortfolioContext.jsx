import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioService } from '../api/portfolioService';
import { profileData } from '../data/profile';
import { projectsData } from '../data/projects';
import { skillsData } from '../data/skills';
import { experienceData } from '../data/experience';
import { educationData } from '../data/education';
import { certificatesData } from '../data/certificates';
import { servicesData } from '../data/services';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState({
    hero: profileData,
    about: {
      ...profileData.about,
      heading: 'Engineering Scalable & Practical Web Solutions',
      highlights: [
        {
          title: 'Full Stack Development',
          description: 'Building responsive, modular client interfaces in React and integrating reliable backend microservices with robust error handling.',
          icon: 'Layers',
        },
        {
          title: 'Java Development',
          description: 'Solid engineering foundation in Core Java, OOP design patterns, Collections framework, Multithreading, and Spring Boot web services.',
          icon: 'Code2',
        },
        {
          title: 'Practical Web Applications',
          description: 'Delivered end-to-end applications including an agricultural e-commerce platform and a digital aluminium recycling workflow system.',
          icon: 'Globe',
        },
        {
          title: 'Problem Solving & Quality',
          description: 'Focused on optimizing frontend render cycles, relational database indexing, clean Git version control, and maintainable project code.',
          icon: 'Cpu',
        },
      ],
    },
    services: servicesData,
    projects: projectsData,
    skills: skillsData.categories,
    rawSkills: [],
    experience: experienceData,
    education: [educationData],
    certificates: certificatesData,
    contact: profileData,
    settings: {
      siteTitle: 'Dinesh M | Full Stack Developer',
      metaDescription: profileData.headline,
      resumeUrl: profileData.resumeUrl,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioService
      .getPortfolio()
      .then((res) => {
        if (res) {
          setData((prev) => ({
            ...prev,
            hero: res.hero || prev.hero,
            about: res.about || prev.about,
            services: res.services?.length ? res.services : prev.services,
            projects: res.projects?.length ? res.projects : prev.projects,
            skills: res.skills && Object.keys(res.skills).length ? res.skills : prev.skills,
            experience: res.experience?.length ? res.experience : prev.experience,
            education: res.education?.length ? res.education : prev.education,
            certificates: res.certificates?.length ? res.certificates : prev.certificates,
            contact: res.contact || prev.contact,
            settings: res.settings || prev.settings,
          }));
        }
      })
      .catch((err) => {
        console.warn('Portfolio data loading notice:', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <PortfolioContext.Provider value={{ ...data, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
