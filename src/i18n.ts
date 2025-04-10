import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        report: "Report Activity",
        admin: "Admin Dashboard"
      },
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        search: "Search",
        filter: "Filter",
        download: "Download",
        refresh: "Refresh",
        logout: "Logout",
        back: "Back"
      },
      login: {
        title: "Admin Login",
        email: "Email",
        password: "Password",
        signIn: "Sign In",
        signInError: "Sign in failed",
        signInSuccess: "Successfully signed in",
        rememberMe: "Remember me"
      },
      admin: {
        dashboard: "Admin Dashboard",
        reports: "All Reports",
        totalReports: "Total Reports",
        todayReports: "Today's Reports",
        pendingReports: "Pending Reports",
        resolvedReports: "Resolved Reports",
        noReports: "No reports found",
        status: "Status",
        date: "Date",
        location: "Location",
        description: "Description",
        actions: "Actions",
        recentActivities: "Recent Activities",
        filterReports: "Filter and manage activity reports",
        searchPlaceholder: "Search reports...",
        dateFilter: "Date Filter",
        clearDate: "Clear Date",
        exportReports: "Export Reports",
        noReportsToExport: "No reports to export",
        exportSuccess: "Reports exported successfully",
        exportAsCsv: "Export as CSV",
        exportAsPdf: "Export as PDF",
        exportError: "Failed to export reports",
        analytics: {
          title: "Analytics",
          tabs: {
            summary: "Summary",
            charts: "Charts"
          },
          totalReports: "Total Reports",
          mostCommonPurpose: "Most Common Purpose",
          mostActiveUser: "Most Active User",
          averageTimeOut: "Average Time Out",
          timeFormat: "{{hours}} hours {{minutes}} minutes",
          charts: {
            topPurposes: "Top Purposes",
            activeUsers: "Active Users Distribution",
            vehicleUsage: "Vehicle Usage Distribution"
          }
        },
        filters: {
          all: "All",
          today: "Today",
          pending: "Pending",
          resolved: "Resolved"
        },
        allReports: "View All Reports",
        clearSearch: "Clear search",
        vehicles: {
          "honda-wave-1293": "Honda Wave 1293",
          "honda-wave-6998": "Honda Wave 6998",
          "honda-wave-0346": "Honda Wave 0346",
          "honda-move-9257": "Honda Move 9257",
          "honda-click-0353": "Honda Click I 0353",
          "toyota-revo-1188": "Toyota Revo 1188",
          "toyota-vios-1188": "Toyota Vios 1188",
          "toyota-vigo-5609": "Toyota Vigo 5609"
        },
        openInMaps: "Open in Google Maps"
      },
      home: {
        title: "MSIG Sokxay Admin Away Log",
        subtitle: "Track and manage field work activities with ease. Designed for admin officers working outside the office.",
        reportActivity: {
          title: "Report Activity",
          description: "Log your field work with details such as purpose, location, and photo evidence.",
          button: "Report Now"
        },
        adminDashboard: {
          title: "Admin Dashboard",
          description: "Monitor field activities, view reports, and analyze data with powerful visualization tools.",
          button: "View Dashboard"
        }
      },
      report: {
        title: "Report Field Activity",
        form: {
          description: "Fill the form with details of your work outside the office",
          userName: "Your Name",
          purpose: "Destination of Trip",
          timeOut: "Start Time",
          timeIn: "Return Time",
          vehicle: "Vehicle Used",
          photo: "Evidence Photo",
          camera: "Camera",
          uploadImage: "Upload Image",
          location: "Current Location",
          captureCurrentLocation: "Capture Current Location",
          notes: "Additional Notes (Optional)",
          submit: "Submit Report",
          submitting: "Submitting...",
          placeholders: {
            userName: "Enter your full name",
            purpose: "Where are you going out?",
            vehicle: "Select a vehicle",
            notes: "Any additional details about your trip...",
            dateFormat: "dd/mm/yyyy"
          },
          locationCaptured: "Captured location",
          errors: {
            nameRequired: "Name is required",
            purposeRequired: "Purpose is required",
            timeOutRequired: "Start time is required",
            timeInRequired: "Return time is required",
            vehicleRequired: "Vehicle is required",
            locationRequired: "Please capture your current location",
            photoRequired: "Please take a photo as evidence"
          },
          success: "Report submitted successfully!",
          error: "Failed to submit report. Please try again."
        }
      },
      reportCard: {
        duration: "Duration",
        vehicle: "Vehicle",
        notes: "Notes",
        location: "Location",
        timeAgo: "{{time}} ago",
        ago: "ago",
        startTime: "Start Time",
        returnTime: "Return Time"
      }
    }
  },
  lo: {
    translation: {
      nav: {
        home: "ໜ້າຫຼັກ",
        report: "ລາຍງານ",
        admin: "ແຜງຄວບຄຸມຜູ້ດູແລລະບົບ"
      },
      common: {
        loading: "ກຳລັງໂຫຼດ...",
        error: "ມີຂໍ້ຜິດພາດ",
        success: "ສຳເລັດ",
        cancel: "ຍົກເລີກ",
        save: "ບັນທຶກ",
        delete: "ລຶບ",
        edit: "ແກ້ໄຂ",
        search: "ຄົ້ນຫາ",
        filter: "ກັ່ນຕອງ",
        download: "ດາວໂຫຼດ",
        refresh: "ຟື້ນຟູ",
        logout: "ອອກຈາກລະບົບ",
        back: "ກັບຄືນ"
      },
      login: {
        title: "ເຂົ້າສູ່ລະບົບຜູ້ດູແລລະບົບ",
        email: "ອີເມວ",
        password: "ລະຫັດຜ່ານ",
        signIn: "ເຂົ້າສູ່ລະບົບ",
        signInError: "ການເຂົ້າສູ່ລະບົບລົ້ມເຫຼວ",
        signInSuccess: "ເຂົ້າສູ່ລະບົບສຳເລັດ",
        rememberMe: "ຈົດຈຳການເຂົ້າສູ່ລະບົບ"
      },
      admin: {
        dashboard: "ໜ້າຄວບຄຸມຜູ້ດູແລລະບົບ",
        reports: "ລາຍງານທັງໝົດ",
        filterReports: "ກັ່ນຕອງ ແລະ ຈັດການລາຍງານວຽກ",
        noReports: "ບໍ່ພົບລາຍງານ",
        searchPlaceholder: "ຄົ້ນຫາລາຍງານ...",
        clearSearch: "ລ້າງການຄົ້ນຫາ",
        exportReports: "ສົ່ງອອກລາຍງານ",
        noReportsToExport: "ບໍ່ມີລາຍງານທີ່ຈະສົ່ງອອກ",
        exportSuccess: "ສົ່ງອອກລາຍງານສຳເລັດແລ້ວ",
        exportAsCsv: "ສົ່ງອອກເປັນ CSV",
        exportAsPdf: "ສົ່ງອອກເປັນ PDF",
        exportError: "ການສົ່ງອອກລາຍງານລົ້ມເຫລວ",
        allReports: "ເບິ່ງລາຍງານທັງໝົດ",
        recentActivities: "ກິດຈະກຳຫຼ້າສຸດ",
        status: "ສະຖານະ",
        date: "ວັນທີ",
        location: "ສະຖານທີ່",
        description: "ລາຍລະອຽດ",
        actions: "ການດຳເນີນການ",
        dateFilter: "ກັ່ນຕອງຕາມວັນທີ",
        clearDate: "ລ້າງວັນທີ",
        vehicles: {
          "honda-wave-1293": "ຮອນດ້າ ເວບ 1293",
          "honda-wave-6998": "ຮອນດ້າ ເວບ 6998",
          "honda-wave-0346": "ຮອນດ້າ ເວບ 0346",
          "honda-move-9257": "ຮອນດ້າ ມູບ 9257",
          "honda-click-0353": "ຮອນດ້າ ຄລິກໄອ 0353",
          "toyota-revo-1188": "ໂຕໂຍຕ້າ ຣີໂວ 1188",
          "toyota-vios-1188": "ໂຕໂຍຕ້າ ວີອອສ 1188",
          "toyota-vigo-5609": "ໂຕໂຍຕ້າ ວີໂກ້ 5609"
        },
        openInMaps: "ເປີດໃນ Google Maps",
        analytics: {
          title: "ການວິເຄາະ",
          tabs: {
            summary: "ສະຫຼຸບ",
            charts: "ແຜນວາດ"
          },
          totalReports: "ລາຍງານທັງໝົດ",
          mostCommonPurpose: "ຈຸດປະສົງທີ່ພົບເລື້ອຍໆ",
          mostActiveUser: "ຜູ້ໃຊ້ທີ່ມີການເຄື່ອນໄຫວຫຼາຍທີ່ສຸດ",
          averageTimeOut: "ເວລາສະເລ່ຍອອກວຽກນອກ",
          timeFormat: "{{hours}} ຊົ່ວໂມງ {{minutes}} ນາທີ",
          charts: {
            topPurposes: "ຈຸດປະສົງຫຼັກ",
            activeUsers: "ສະຖິຕິຜູ້ໃຊ້ທີ່ມີການເຄື່ອນໄຫວ",
            vehicleUsage: "ສະຖິຕິການນຳໃຊ້ພາຫະນະ"
          }
        }
      },
      home: {
        title: "ລະບົບບັນທຶກການອອກວຽກນອກພະນັກງານ MSIG Sokxay",
        subtitle: "ຕິດຕາມ ແລະ ຈັດການກິດຈະກຳການອອກວຽກນອກຢ່າງງ່າຍດາຍ. ອອກແບບສະເພາະສຳລັບພະນັກງານແອັດມິນທີ່ໄປວຽກນອກຫ້ອງການ.",
        reportActivity: {
          title: "ລາຍງານວຽກງານ",
          description: "ບັນທຶກການອອກວຽກນອກຂອງທ່ານພ້ອມລາຍລະອຽດເຊັ່ນ ຈຸດປະສົງ, ສະຖານທີ່, ແລະ ຫຼັກຖານຮູບພາບ.",
          button: "ລາຍງານຕອນນີ້"
        },
        adminDashboard: {
          title: "ແຜງຄວບຄຸມຜູ້ດູແລລະບົບ",
          description: "ຕິດຕາມການອອກວຽກນອກ, ເບິ່ງລາຍງານ, ແລະ ວິເຄາະຂໍ້ມູນດ້ວຍເຄື່ອງມືການສະແດງຜົນທີ່ມີປະສິດທິພາບ.",
          button: "ເບິ່ງແຜງຄວບຄຸມ"
        }
      },
      report: {
        title: "ລາຍງານການອອກວຽກນອກ",
        form: {
          description: "ຕື່ມຂໍ້ມູນລາຍລະອຽດກ່ຽວກັບການເຮັດວຽກຂອງທ່ານຢູ່ນອກຫ້ອງການ",
          userName: "ຊື່ຂອງທ່ານ",
          purpose: "ຈຸດໝາຍຂອງການເດີນທາງ",
          timeOut: "ເວລາເລີ່ມຕົ້ນ",
          timeIn: "ເວລາກັບຄືນ",
          vehicle: "ພາຫະນະທີ່ໃຊ້",
          photo: "ຫຼັກຖານຮູບພາບ",
          camera: "ຖ່າຍຮູບ",
          uploadImage: "ອັບໂຫຼດຮູບພາບ",
          location: "ສະຖານທີ່ປັດຈຸບັນ",
          captureCurrentLocation: "ບັນທຶກທີ່ຕັ້ງປັດຈຸບັນ",
          notes: "ໝາຍເຫດເສີມ (ທາງເລືອກ)",
          submit: "ສົ່ງລາຍງານ",
          submitting: "ກຳລັງສົ່ງ...",
          placeholders: {
            userName: "ປ້ອນຊື່ເຕັມຂອງທ່ານ",
            purpose: "ທ່ານກຳລັງຈະໄປສະຖານທີ່ໃດ?",
            vehicle: "ເລືອກພາຫະນະທີ່ຈະນຳໃຊ້",
            notes: "ຂໍ້ມູນເສີມເກີດຂຶ້ນກັບການເດີນທາງຂອງທ່ານ...",
            dateFormat: "ວັນທີ/ເດືອນ/ປີ"
          },
          locationCaptured: "ສະຖານທີ່ທີ່ບັນທຶກ",
          errors: {
            nameRequired: "ກະລຸນາປ້ອນຊື່",
            purposeRequired: "ກະລຸນາລະບຸຈຸດປະສົງ",
            timeOutRequired: "ກະລຸນາລະບຸເວລາເລີ່ມຕົ້ນ",
            timeInRequired: "ກະລຸນາລະບຸເວລາກັບຄືນ",
            vehicleRequired: "ກະລຸນາເລືອກພາຫະນະ",
            locationRequired: "ກະລຸນາບັນທຶກສະຖານທີ່ປັດຈຸບັນຂອງທ່ານ",
            photoRequired: "ກະລຸນາຖ່າຍຮູບເປັນຫຼັກຖານ"
          },
          success: "ສົ່ງລາຍງານສຳເລັດ!",
          error: "ການສົ່ງລາຍງານລົ້ມເຫຼວ. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ."
        }
      },
      reportCard: {
        duration: "ໄລຍະເວລາ",
        vehicle: "ພາຫະນະ",
        notes: "ໝາຍເຫດ",
        location: "ສະຖານທີ່",
        timeAgo: "{{time}} ຜ່ານມາ",
        ago: "ຜ່ານມາ",
        startTime: "ເວລາເລີ່ມຕົ້ນ",
        returnTime: "ເວລາກັບຄືນ"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 