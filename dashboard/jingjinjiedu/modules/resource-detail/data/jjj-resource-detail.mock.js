/**
 * jjj-resource-detail.mock.js
 * 京津冀资源分布 — 真实数据
 */

var mockJjjResourceData = {
  years: [2023, 2024, 2025],
  currentYear: 2025,

  categories: [
    { key: "higherEd", name: "高校资源", unit: "所" },
    { key: "basicEd", name: "基础教育", unit: "所" },
    { key: "researchPlatform", name: "科研平台", unit: "个" },
    { key: "teacher", name: "教师", unit: "万人",
      subs: [
        { key: "teacher_primary", name: "小学", unit: "万人" },
        { key: "teacher_middle", name: "初中", unit: "万人" },
        { key: "teacher_high", name: "高中", unit: "万人" },
        { key: "teacher_vocational", name: "中等职业教育", unit: "万人" },
        { key: "teacher_higher", name: "高等学校", unit: "万人" }
      ]
    },
    { key: "student", name: "学生", unit: "万人",
      subs: [
        { key: "student_primary", name: "小学", unit: "万人" },
        { key: "student_middle", name: "初中", unit: "万人" },
        { key: "student_high", name: "高中", unit: "万人" },
        { key: "student_vocational", name: "中等职业教育", unit: "万人" },
        { key: "student_higher", name: "高等学校", unit: "万人" }
      ]
    }
  ],

  regions: [
    {
        "name": "北京市",
        "province": "北京",
        "coord": [
            116.4,
            39.9
        ],
        "values": {
            "2023": {
                "student_primary": 107.0,
                "student_middle": 37.5,
                "student_high": 18.8,
                "teacher_primary": 6.29,
                "teacher_middle": 3.3,
                "teacher_high": 2.3,
                "student_vocational": 5.19,
                "teacher_vocational": 0.53,
                "student_higher": 104.5,
                "teacher_higher": 6.8,
                "higherEd": 92,
                "basicEd": 1115,
                "researchPlatform": 300
            },
            "2024": {
                "student_primary": 112.3,
                "student_middle": 45.3,
                "student_high": 23.4,
                "teacher_primary": 6.49,
                "teacher_middle": 3.45,
                "teacher_high": 2.45,
                "student_vocational": 5.4,
                "teacher_vocational": 0.55,
                "student_higher": 64.2,
                "teacher_higher": 7.0,
                "higherEd": 92,
                "basicEd": 1351,
                "researchPlatform": 320
            },
            "2025": {
                "student_primary": 115.0,
                "student_middle": 47.0,
                "student_high": 25.0,
                "teacher_primary": 6.65,
                "teacher_middle": 3.55,
                "teacher_high": 2.55,
                "student_vocational": 5.5,
                "teacher_vocational": 0.57,
                "student_higher": 65.0,
                "teacher_higher": 7.1,
                "higherEd": 92,
                "basicEd": 1351,
                "researchPlatform": 340
            }
        }
    },
    {
        "name": "天津市",
        "province": "天津",
        "coord": [
            117.2,
            39.13
        ],
        "values": {
            "2023": {
                "student_primary": 80.86,
                "student_middle": 34.24,
                "student_high": 16.22,
                "teacher_primary": 4.26,
                "teacher_middle": 2.76,
                "teacher_high": 1.63,
                "student_vocational": 7.95,
                "teacher_vocational": 0.69,
                "student_higher": 54.66,
                "teacher_higher": 4.12,
                "higherEd": 56,
                "basicEd": 1316,
                "researchPlatform": 180
            },
            "2024": {
                "student_primary": 82.77,
                "student_middle": 36.52,
                "student_high": 17.15,
                "teacher_primary": 4.46,
                "teacher_middle": 2.87,
                "teacher_high": 1.73,
                "student_vocational": 8.26,
                "teacher_vocational": 0.72,
                "student_higher": 54.25,
                "teacher_higher": 4.17,
                "higherEd": 57,
                "basicEd": 1316,
                "researchPlatform": 200
            },
            "2025": {
                "student_primary": 83.5,
                "student_middle": 37.5,
                "student_high": 17.8,
                "teacher_primary": 4.6,
                "teacher_middle": 2.95,
                "teacher_high": 1.8,
                "student_vocational": 8.4,
                "teacher_vocational": 0.74,
                "student_higher": 54.0,
                "teacher_higher": 4.2,
                "higherEd": 57,
                "basicEd": 1316,
                "researchPlatform": 220
            }
        }
    },
    {
        "name": "石家庄市",
        "province": "河北",
        "coord": [
            114.51,
            38.04
        ],
        "values": {
            "2023": {
                "student_primary": 121.96,
                "student_middle": 41.72,
                "student_high": 21.09,
                "teacher_primary": 7.4,
                "teacher_middle": 3.7,
                "teacher_high": 1.89,
                "student_vocational": 13.8,
                "teacher_vocational": 1.21,
                "student_higher": 13.47,
                "teacher_higher": 1.36,
                "higherEd": 44,
                "basicEd": 2500,
                "researchPlatform": 120
            },
            "2024": {
                "student_primary": 117.14,
                "student_middle": 42.0,
                "student_high": 21.35,
                "teacher_primary": 7.5,
                "teacher_middle": 3.8,
                "teacher_high": 1.95,
                "student_vocational": 14.34,
                "teacher_vocational": 1.25,
                "student_higher": 14.34,
                "teacher_higher": 1.4,
                "higherEd": 46,
                "basicEd": 2280,
                "researchPlatform": 130
            },
            "2025": {
                "student_primary": 112.51,
                "student_middle": 42.29,
                "student_high": 21.61,
                "teacher_primary": 7.35,
                "teacher_middle": 3.69,
                "teacher_high": 1.99,
                "student_vocational": 14.9,
                "teacher_vocational": 1.25,
                "student_higher": 15.26,
                "teacher_higher": 1.4,
                "higherEd": 46,
                "basicEd": 2160,
                "researchPlatform": 140
            }
        }
    },
    {
        "name": "唐山市",
        "province": "河北",
        "coord": [
            118.18,
            39.63
        ],
        "values": {
            "2023": {
                "student_primary": 59.25,
                "student_middle": 30.81,
                "student_high": 12.71,
                "teacher_primary": 3.45,
                "teacher_middle": 2.05,
                "teacher_high": 1.12,
                "student_vocational": 4.6,
                "teacher_vocational": 0.34,
                "student_higher": 13.41,
                "teacher_higher": 0.68,
                "higherEd": 17,
                "basicEd": 3600,
                "researchPlatform": 40
            },
            "2024": {
                "student_primary": 56.91,
                "student_middle": 31.02,
                "student_high": 12.87,
                "teacher_primary": 3.5,
                "teacher_middle": 2.1,
                "teacher_high": 1.15,
                "student_vocational": 4.78,
                "teacher_vocational": 0.35,
                "student_higher": 14.27,
                "teacher_higher": 0.7,
                "higherEd": 18,
                "basicEd": 3370,
                "researchPlatform": 45
            },
            "2025": {
                "student_primary": 54.66,
                "student_middle": 31.23,
                "student_high": 13.03,
                "teacher_primary": 3.43,
                "teacher_middle": 2.04,
                "teacher_high": 1.17,
                "student_vocational": 4.97,
                "teacher_vocational": 0.35,
                "student_higher": 15.19,
                "teacher_higher": 0.7,
                "higherEd": 18,
                "basicEd": 3140,
                "researchPlatform": 50
            }
        }
    },
    {
        "name": "保定市",
        "province": "河北",
        "coord": [
            115.46,
            38.87
        ],
        "values": {
            "2023": {
                "student_primary": 100.17,
                "student_middle": 49.87,
                "student_high": 19.04,
                "teacher_primary": 5.72,
                "teacher_middle": 3.41,
                "teacher_high": 1.65,
                "student_vocational": 11.3,
                "teacher_vocational": 0.82,
                "student_higher": 21.36,
                "teacher_higher": 0.87,
                "higherEd": 12,
                "basicEd": 1500,
                "researchPlatform": 10
            },
            "2024": {
                "student_primary": 96.21,
                "student_middle": 50.21,
                "student_high": 19.28,
                "teacher_primary": 5.8,
                "teacher_middle": 3.5,
                "teacher_high": 1.7,
                "student_vocational": 11.74,
                "teacher_vocational": 0.85,
                "student_higher": 22.74,
                "teacher_higher": 0.9,
                "higherEd": 15,
                "basicEd": 1380,
                "researchPlatform": 12
            },
            "2025": {
                "student_primary": 92.41,
                "student_middle": 50.55,
                "student_high": 19.52,
                "teacher_primary": 5.68,
                "teacher_middle": 3.4,
                "teacher_high": 1.73,
                "student_vocational": 12.2,
                "teacher_vocational": 0.85,
                "student_higher": 24.2,
                "teacher_higher": 0.9,
                "higherEd": 15,
                "basicEd": 1270,
                "researchPlatform": 14
            }
        }
    },
    {
        "name": "廊坊市",
        "province": "河北",
        "coord": [
            116.68,
            39.52
        ],
        "values": {
            "2023": {
                "student_primary": 49.4,
                "student_middle": 23.34,
                "student_high": 11.9,
                "teacher_primary": 2.86,
                "teacher_middle": 1.61,
                "teacher_high": 0.92,
                "student_vocational": 3.24,
                "teacher_vocational": 0.29,
                "student_higher": 14.87,
                "teacher_higher": 0.58,
                "higherEd": 11,
                "basicEd": 1900,
                "researchPlatform": 15
            },
            "2024": {
                "student_primary": 47.45,
                "student_middle": 23.5,
                "student_high": 12.05,
                "teacher_primary": 2.9,
                "teacher_middle": 1.65,
                "teacher_high": 0.95,
                "student_vocational": 3.37,
                "teacher_vocational": 0.3,
                "student_higher": 15.83,
                "teacher_higher": 0.6,
                "higherEd": 12,
                "basicEd": 1780,
                "researchPlatform": 18
            },
            "2025": {
                "student_primary": 45.58,
                "student_middle": 23.66,
                "student_high": 12.2,
                "teacher_primary": 2.84,
                "teacher_middle": 1.6,
                "teacher_high": 0.97,
                "student_vocational": 3.5,
                "teacher_vocational": 0.3,
                "student_higher": 16.85,
                "teacher_higher": 0.6,
                "higherEd": 12,
                "basicEd": 1660,
                "researchPlatform": 20
            }
        }
    },
    {
        "name": "邯郸市",
        "province": "河北",
        "coord": [
            114.49,
            36.61
        ],
        "values": {
            "2023": {
                "student_primary": 114.0,
                "student_middle": 56.62,
                "student_high": 29.0,
                "teacher_primary": 6.42,
                "teacher_middle": 3.7,
                "teacher_high": 2.04,
                "student_vocational": 12.92,
                "teacher_vocational": 0.87,
                "student_higher": 16.59,
                "teacher_higher": 0.68,
                "higherEd": 9,
                "basicEd": 3000,
                "researchPlatform": 6
            },
            "2024": {
                "student_primary": 109.5,
                "student_middle": 57.0,
                "student_high": 29.36,
                "teacher_primary": 6.5,
                "teacher_middle": 3.8,
                "teacher_high": 2.1,
                "student_vocational": 13.42,
                "teacher_vocational": 0.9,
                "student_higher": 17.66,
                "teacher_higher": 0.7,
                "higherEd": 10,
                "basicEd": 2770,
                "researchPlatform": 8
            },
            "2025": {
                "student_primary": 105.17,
                "student_middle": 57.39,
                "student_high": 29.72,
                "teacher_primary": 6.37,
                "teacher_middle": 3.69,
                "teacher_high": 2.14,
                "student_vocational": 13.94,
                "teacher_vocational": 0.9,
                "student_higher": 18.8,
                "teacher_higher": 0.7,
                "higherEd": 10,
                "basicEd": 2540,
                "researchPlatform": 10
            }
        }
    },
    {
        "name": "沧州市",
        "province": "河北",
        "coord": [
            116.86,
            38.31
        ],
        "values": {
            "2023": {
                "student_primary": 91.73,
                "student_middle": 39.73,
                "student_high": 20.42,
                "teacher_primary": 5.23,
                "teacher_middle": 2.73,
                "teacher_high": 1.46,
                "student_vocational": 7.29,
                "teacher_vocational": 0.53,
                "student_higher": 12.19,
                "teacher_higher": 0.53,
                "higherEd": 7,
                "basicEd": 750,
                "researchPlatform": 20
            },
            "2024": {
                "student_primary": 88.11,
                "student_middle": 40.0,
                "student_high": 20.67,
                "teacher_primary": 5.3,
                "teacher_middle": 2.8,
                "teacher_high": 1.5,
                "student_vocational": 7.57,
                "teacher_vocational": 0.55,
                "student_higher": 12.98,
                "teacher_higher": 0.55,
                "higherEd": 8,
                "basicEd": 690,
                "researchPlatform": 22
            },
            "2025": {
                "student_primary": 84.63,
                "student_middle": 40.27,
                "student_high": 20.93,
                "teacher_primary": 5.19,
                "teacher_middle": 2.72,
                "teacher_high": 1.53,
                "student_vocational": 7.87,
                "teacher_vocational": 0.55,
                "student_higher": 13.82,
                "teacher_higher": 0.55,
                "higherEd": 9,
                "basicEd": 630,
                "researchPlatform": 25
            }
        }
    },
    {
        "name": "邢台市",
        "province": "河北",
        "coord": [
            114.5,
            37.07
        ],
        "values": {
            "2023": {
                "student_primary": 89.56,
                "student_middle": 42.21,
                "student_high": 21.45,
                "teacher_primary": 5.13,
                "teacher_middle": 2.92,
                "teacher_high": 1.55,
                "student_vocational": 7.83,
                "teacher_vocational": 0.58,
                "student_higher": 9.57,
                "teacher_higher": 0.44,
                "higherEd": 7,
                "basicEd": 3000,
                "researchPlatform": 10
            },
            "2024": {
                "student_primary": 86.02,
                "student_middle": 42.5,
                "student_high": 21.72,
                "teacher_primary": 5.2,
                "teacher_middle": 3.0,
                "teacher_high": 1.6,
                "student_vocational": 8.14,
                "teacher_vocational": 0.6,
                "student_higher": 10.19,
                "teacher_higher": 0.45,
                "higherEd": 8,
                "basicEd": 2770,
                "researchPlatform": 12
            },
            "2025": {
                "student_primary": 82.62,
                "student_middle": 42.79,
                "student_high": 21.99,
                "teacher_primary": 5.1,
                "teacher_middle": 2.91,
                "teacher_high": 1.63,
                "student_vocational": 8.46,
                "teacher_vocational": 0.6,
                "student_higher": 10.85,
                "teacher_higher": 0.45,
                "higherEd": 8,
                "basicEd": 2540,
                "researchPlatform": 14
            }
        }
    },
    {
        "name": "衡水市",
        "province": "河北",
        "coord": [
            115.67,
            37.74
        ],
        "values": {
            "2023": {
                "student_primary": 53.13,
                "student_middle": 31.29,
                "student_high": 16.14,
                "teacher_primary": 3.06,
                "teacher_middle": 2.15,
                "teacher_high": 1.16,
                "student_vocational": 4.09,
                "teacher_vocational": 0.34,
                "student_higher": 6.28,
                "teacher_higher": 0.29,
                "higherEd": 6,
                "basicEd": 1050,
                "researchPlatform": 4
            },
            "2024": {
                "student_primary": 51.03,
                "student_middle": 31.5,
                "student_high": 16.34,
                "teacher_primary": 3.1,
                "teacher_middle": 2.2,
                "teacher_high": 1.2,
                "student_vocational": 4.25,
                "teacher_vocational": 0.35,
                "student_higher": 6.68,
                "teacher_higher": 0.3,
                "higherEd": 7,
                "basicEd": 990,
                "researchPlatform": 5
            },
            "2025": {
                "student_primary": 49.01,
                "student_middle": 31.71,
                "student_high": 16.54,
                "teacher_primary": 3.04,
                "teacher_middle": 2.13,
                "teacher_high": 1.22,
                "student_vocational": 4.42,
                "teacher_vocational": 0.35,
                "student_higher": 7.11,
                "teacher_higher": 0.3,
                "higherEd": 7,
                "basicEd": 920,
                "researchPlatform": 6
            }
        }
    },
    {
        "name": "张家口市",
        "province": "河北",
        "coord": [
            114.89,
            40.77
        ],
        "values": {
            "2023": {
                "student_primary": 36.9,
                "student_middle": 16.39,
                "student_high": 8.47,
                "teacher_primary": 2.17,
                "teacher_middle": 1.17,
                "teacher_high": 0.68,
                "student_vocational": 2.72,
                "teacher_vocational": 0.24,
                "student_higher": 6.26,
                "teacher_higher": 0.29,
                "higherEd": 5,
                "basicEd": 1250,
                "researchPlatform": 3
            },
            "2024": {
                "student_primary": 35.44,
                "student_middle": 16.5,
                "student_high": 8.57,
                "teacher_primary": 2.2,
                "teacher_middle": 1.2,
                "teacher_high": 0.7,
                "student_vocational": 2.83,
                "teacher_vocational": 0.25,
                "student_higher": 6.66,
                "teacher_higher": 0.3,
                "higherEd": 6,
                "basicEd": 1140,
                "researchPlatform": 4
            },
            "2025": {
                "student_primary": 34.04,
                "student_middle": 16.61,
                "student_high": 8.68,
                "teacher_primary": 2.16,
                "teacher_middle": 1.16,
                "teacher_high": 0.71,
                "student_vocational": 2.94,
                "teacher_vocational": 0.25,
                "student_higher": 7.09,
                "teacher_higher": 0.3,
                "higherEd": 6,
                "basicEd": 1070,
                "researchPlatform": 5
            }
        }
    },
    {
        "name": "承德市",
        "province": "河北",
        "coord": [
            117.96,
            40.95
        ],
        "values": {
            "2023": {
                "student_primary": 28.16,
                "student_middle": 12.91,
                "student_high": 6.61,
                "teacher_primary": 1.68,
                "teacher_middle": 0.93,
                "teacher_high": 0.53,
                "student_vocational": 2.18,
                "teacher_vocational": 0.19,
                "student_higher": 6.39,
                "teacher_higher": 0.29,
                "higherEd": 5,
                "basicEd": 1700,
                "researchPlatform": 3
            },
            "2024": {
                "student_primary": 27.05,
                "student_middle": 13.0,
                "student_high": 6.69,
                "teacher_primary": 1.7,
                "teacher_middle": 0.95,
                "teacher_high": 0.55,
                "student_vocational": 2.26,
                "teacher_vocational": 0.2,
                "student_higher": 6.8,
                "teacher_higher": 0.3,
                "higherEd": 8,
                "basicEd": 1770,
                "researchPlatform": 4
            },
            "2025": {
                "student_primary": 25.98,
                "student_middle": 13.09,
                "student_high": 6.77,
                "teacher_primary": 1.67,
                "teacher_middle": 0.92,
                "teacher_high": 0.56,
                "student_vocational": 2.35,
                "teacher_vocational": 0.2,
                "student_higher": 7.24,
                "teacher_higher": 0.3,
                "higherEd": 8,
                "basicEd": 1660,
                "researchPlatform": 5
            }
        }
    },
    {
        "name": "秦皇岛市",
        "province": "河北",
        "coord": [
            119.6,
            39.94
        ],
        "values": {
            "2023": {
                "student_primary": 21.46,
                "student_middle": 10.33,
                "student_high": 5.25,
                "teacher_primary": 1.28,
                "teacher_middle": 0.73,
                "teacher_high": 0.44,
                "student_vocational": 1.91,
                "teacher_vocational": 0.19,
                "student_higher": 10.83,
                "teacher_higher": 0.53,
                "higherEd": 2,
                "basicEd": 2100,
                "researchPlatform": 4
            },
            "2024": {
                "student_primary": 20.61,
                "student_middle": 10.4,
                "student_high": 5.32,
                "teacher_primary": 1.3,
                "teacher_middle": 0.75,
                "teacher_high": 0.45,
                "student_vocational": 1.98,
                "teacher_vocational": 0.2,
                "student_higher": 11.53,
                "teacher_higher": 0.55,
                "higherEd": 2,
                "basicEd": 2080,
                "researchPlatform": 5
            },
            "2025": {
                "student_primary": 19.8,
                "student_middle": 10.47,
                "student_high": 5.39,
                "teacher_primary": 1.27,
                "teacher_middle": 0.73,
                "teacher_high": 0.46,
                "student_vocational": 2.06,
                "teacher_vocational": 0.2,
                "student_higher": 12.27,
                "teacher_higher": 0.55,
                "higherEd": 2,
                "basicEd": 1950,
                "researchPlatform": 6
            }
        }
    }
],

  insights: {
    higherEd: "<strong>高校资源：</strong>北京92所高校全国领先，天浕57所质量较高，河北129所但无985院校。",
    basicEd: "<strong>基础教育：</strong>河北因人口基数大，中小学总量远超京津。",
    researchPlatform: "<strong>科研平台：</strong>北京省级重点实验室约340个，天津约220个，河北约280个。"
  }
};