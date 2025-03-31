import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ClipboardList, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function Index() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('home.title')}</h1>
        <p className="text-xl text-gray-600">{t('home.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-3">{t('home.reportActivity.title')}</h2>
          <p className="text-gray-600 mb-4">{t('home.reportActivity.description')}</p>
          <Button onClick={() => navigate("/report")} className="w-full">
            {t('home.reportActivity.button')}
          </Button>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-3">{t('home.adminDashboard.title')}</h2>
          <p className="text-gray-600 mb-4">{t('home.adminDashboard.description')}</p>
          <Button onClick={() => navigate("/admin")} className="w-full">
            {t('home.adminDashboard.button')}
          </Button>
        </div>
      </div>
    </div>
  );
}
