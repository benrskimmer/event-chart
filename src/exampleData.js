const sampleEvents = {

  '1st Dataset': [
    {
      id: 1,
      name: "Winter Break",
      start: "2023-01-01",
      end: "2023-02-28"
    },
    {
      id: 2,
      name: "Art Festival",
      start: "2023-02-14",
      end: "2023-04-30"
    },
    {
      id: 3,
      name: "Science Symposium",
      start: "2023-03-20",
      end: "2023-06-01"
    },
    {
      id: 4,
      name: "Music Festival",
      start: "2023-04-15",
      end: "2023-07-01"
    },
    {
      id: 5,
      name: "Spring Break",
      start: "2023-04-15",
      end: "2023-06-30"
    },
    {
      id: 6,
      name: "Nature Expedition",
      start: "2023-05-10",
      end: "2023-07-31"
    },
    {
      id: 7,
      name: "Film Festival",
      start: "2023-05-25",
      end: "2023-08-10"
    },
    {
      id: 8,
      name: "Creative Workshop",
      start: "2023-06-01",
      end: "2023-08-31"
    },
    {
      id: 9,
      name: "Earth Day Celebration",
      start: "2023-07-01",
      end: "2023-10-30"
    },
    {
      id: 10,
      name: "Summer Camp",
      start: "2023-07-05",
      end: "2023-09-30"
    },
    {
      id: 11,
      name: "Harvest Festival",
      start: "2023-07-20",
      end: "2023-11-01"
    },
    {
      id: 12,
      name: "International Day",
      start: "2023-08-10",
      end: "2023-11-30"
    },
    {
      id: 13,
      name: "Hiking Adventure",
      start: "2023-08-20",
      end: "2023-12-31"
    },
    {
      id: 14,
      name: "Independence Day Celebration",
      start: "2023-09-10",
      end: "2023-12-31"
    },
    {
      id: 15,
      name: "Summer Break",
      start: "2023-09-25",
      end: "2024-02-29"
    },
    {
      id: 16,
      name: "Beach Vacation",
      start: "2023-10-05",
      end: "2024-02-29"
    },
    {
      id: 17,
      name: "International Music Day",
      start: "2023-11-01",
      end: "2024-01-31"
    },
    {
      id: 18,
      name: "Summer Olympics",
      start: "2023-11-20",
      end: "2024-03-31"
    },
    {
      id: 19,
      name: "Labor Day Weekend",
      start: "2023-12-15",
      end: "2024-05-31"
    }
  ],
  
  '2nd Dataset': [
    {
      id: 1,
      start: "2018-01-01",
      end: "2018-01-05",
      name: "Project Kickoff"
    },
    {
      id: 2,
      start: "2018-01-02",
      end: "2018-01-08",
      name: "Market Research"
    },
    {
      id: 3,
      start: "2018-01-06",
      end: "2018-01-28",
      name: "Design Phase"
    },
    {
      id: 4,
      start: "2018-01-14",
      end: "2018-01-14",
      name: "Budget Approval"
    },
    {
      id: 5,
      start: "2018-02-01",
      end: "2018-02-15",
      name: "Development Sprint 1"
    },
    {
      id: 6,
      start: "2018-01-12",
      end: "2018-02-16",
      name: "Marketing Campaign Preparation"
    },
    {
      id: 7,
      start: "2018-02-01",
      end: "2018-02-02",
      name: "Team Building Workshop"
    },
    {
      id: 8,
      start: "2018-01-03",
      end: "2018-01-05",
      name: "Stakeholder Meeting"
    },
    {
      id: 9,
      start: "2018-01-04",
      end: "2018-01-08",
      name: "Product Ideation"
    },
    {
      id: 10,
      start: "2018-01-06",
      end: "2018-01-13",
      name: "User Testing"
    },
    {
      id: 11,
      start: "2018-01-09",
      end: "2018-01-09",
      name: "QA Strategy Planning"
    },
    {
      id: 12,
      start: "2018-02-01",
      end: "2018-02-15",
      name: "Development Sprint 2"
    },
    {
      id: 13,
      start: "2018-01-12",
      end: "2018-02-16",
      name: "Partnership Negotiations"
    },
    {
      id: 14,
      start: "2018-02-05",
      end: "2018-02-10",
      name: "Sales Training"
    }
  ],

  '3rd Dataset': [
    {
      id: 1,
      start: "2018-01-01",
      end: "2018-01-07",
      name: "Project Kickoff"
    },
    {
      id: 2,
      start: "2018-01-08",
      end: "2018-01-21",
      name: "Market Research"
    },
    {
      id: 3,
      start: "2018-01-22",
      end: "2018-02-18",
      name: "Design Phase"
    },
    {
      id: 4,
      start: "2018-02-19",
      end: "2018-02-25",
      name: "Budget Approval"
    },
    {
      id: 5,
      start: "2018-03-01",
      end: "2018-09-01",
      name: "Development"
    },
    {
      id: 6,
      start: "2018-03-01",
      end: "2018-12-31",
      name: "Marketing Campaign"
    },
    {
      id: 7,
      start: "2018-04-02",
      end: "2018-04-08",
      name: "Team Building Workshop"
    },
    {
      id: 8,
      start: "2018-05-01",
      end: "2018-05-07",
      name: "Stakeholder Meeting"
    },
    {
      id: 9,
      start: "2018-05-14",
      end: "2018-05-20",
      name: "Product Ideation"
    },
    {
      id: 10,
      start: "2018-06-04",
      end: "2018-06-10",
      name: "User Testing"
    },
    {
      id: 11,
      start: "2018-07-01",
      end: "2018-07-07",
      name: "QA Strategy Planning"
    },
    {
      id: 12,
      start: "2018-09-03",
      end: "2018-09-09",
      name: "Beta Testing"
    },
    {
      id: 13,
      start: "2018-10-01",
      end: "2018-12-31",
      name: "Partnership Negotiations"
    },
    {
      id: 14,
      start: "2018-11-05",
      end: "2018-11-11",
      name: "Sales Training"
    } 
  ],
}

export default sampleEvents;