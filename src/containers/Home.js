import React, { Component } from 'react';
import logo from '../logo.svg';
import { withRouter } from 'react-router-dom';
import PieChart from '../components/PieChart'
import Ionicon from 'react-ionicons'
import { LIST_VIEW, CHART_VIEW, TYPE_INCOME, TYPE_OUTCOME } from '../utility'
import PriceList from '../components/PriceList';
import TotalPrice from '../components/TotalPrice';
import Loader from '../components/Loader';
import CreateBtn from '../components/CreateBtn';
import MonthPicker from '../components/MonthPicker';
import { Tabs, Tab } from '../components/Tabs';
import withContext from '../WithContext';

const tabsText = [LIST_VIEW, CHART_VIEW]

const generateChartDataByCategory = (items, type = TYPE_INCOME) => {
   let categoryMap = {}
   items.filter(item => item.category.type === type).forEach((item) => {
    if (categoryMap[item.cid]) {
      categoryMap[item.cid].value += (item.price * 1)
      categoryMap[item.cid].items = [...categoryMap[item.cid].items, item.id]
    } else {
      categoryMap[item.cid] = {
        name: item.category.name,
        value: item.price * 1,
        items: [item.id]
      }
    }
  })
   return Object.keys(categoryMap).map(mapKey => ({ ...categoryMap[mapKey] }))
}

  class Home extends Component {
      constructor(props) {
        super(props)
        this.state = {
          tabView: tabsText[0],
        }
      }


      componentDidMount() {
        this.props.actions.getInitialData()
      }
      

      changeView = (index) => {
         this.setState({
           tabView: tabsText[index],
         })
      }

      changeDate = (year, month) => {
        this.props.actions.selectNewMonth(year, month)
      }

      modifyItem = (item) => {
        this.props.history.push(`/edit/${item.id}`)
      }

      createItem = () => {
          this.props.history.push('./create')
      }

      deleteItem = (item) => {
          this.props.actions.deleteItem(item)
      }

      render() {
          const { data } = this.props;
          const { items, categories, currentDate, isLoading } = data
          const { tabView } = this.state;
          const itemsWithCategory = Object.keys(items).map(id => {
            items[id].category = categories[items[id].cid]
            return items[id]
          })
          
          const chartOutcomDataByCategory = generateChartDataByCategory(itemsWithCategory, TYPE_OUTCOME)
          const chartIncomeDataByCategory = generateChartDataByCategory(itemsWithCategory, TYPE_INCOME)
          
          let totalIncome = 0, totalOutcome = 0
          itemsWithCategory.forEach(item => {
              if (item.category.type === TYPE_OUTCOME) {
                  totalOutcome += item.price
              }else {
                  totalIncome += item.price
              }
          })
          return(
                      <React.Fragment>
                          <header className="App-header">
                              <div className="row mb-5">
                                <img src={logo} className="App-logo" alt="logo" />
                              </div>
                              <div className="row">
                                  <div className="col">
                                      <MonthPicker
                                        year={currentDate.year}
                                        month={currentDate.month}
                                        onChange={this.changeDate}
                                      />
                                  </div>
                                  <div className="col">
                                      <TotalPrice
                                        income={totalIncome}
                                        outcome={totalOutcome}
                                      />
                                  </div>
                              </div>
                          </header>
                          <div className="content-area py-3 px - 3">
                               { isLoading && 
                                  <Loader/>
                               }
                               {  !isLoading && 
                                <React.Fragment>
                                    <Tabs activeIndex={0} onTabChange={this.changeView}>
                                      <Tab>
                                          <Ionicon 
                                            className="rounded-circle mr-2" 
                                            fontSize="25px"
                                            color={'#007bff'}
                                            icon='ios-paper'
                                          />
                                          List Mode
                                      </Tab>
                                      <Tab>
                                      <Ionicon 
                                            className="rounded-circle mr-2" 
                                            fontSize="25px"
                                            color={'#007bff'}
                                            icon='ios-pie'
                                      />
                                          Graph Mode
                                      </Tab>
                                    </Tabs>
                                
                                  <CreateBtn onClick={this.createItem}/>
                                  { tabView === LIST_VIEW && itemsWithCategory.length > 0 &&
                                    <PriceList 
                                      items={itemsWithCategory}
                                      onModifyItem={this.modifyItem}
                                      onDeleteItem={this.deleteItem}
                                    />
                                  }
                                   { tabView === LIST_VIEW && itemsWithCategory.length === 0 &&
                                    <div className="alert alert-light text-center no-record">
                                      You do not have any record
                                    </div>
                                  }
                                   { tabView === CHART_VIEW &&
                                      <React.Fragment>
                                        <PieChart title="Outcome" categoryData={chartOutcomDataByCategory} />
                                        <PieChart title="Income" categoryData={chartIncomeDataByCategory} />
                                      </React.Fragment>
                                   }
                                 </React.Fragment>
                        }
                          </div>
                      </React.Fragment>
                  )
      }
 }

 export default withRouter(withContext(Home))